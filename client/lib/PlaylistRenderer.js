import Tone from 'tone'
import isEqual from 'lodash.isequal'

import config from '../../config'
import { getTrakRenderer } from './TrakRenderer'

const trakRenderer = getTrakRenderer()
const baseSampleUrl = config('s3SampleBucket')
const baseTrakUrl = config('s3TrakBucket')
let bufferCache = {}
let playlistBuffer
let playlistRenderer
let player = null
let cachedStagedBuffer
let cachedStagedSample

function loadSample (instance, loadTaskCb, fetchTrak) {
  return new Promise((resolve, reject) => {
    const baseUrl = fetchTrak
      ? baseTrakUrl
      : baseSampleUrl

    const url = `${baseUrl}/${instance.sample.url}`

    let downloadAttempts = 0

    function attemptToLoadBuffer () {
      downloadAttempts++

      // try to download this three times
      // bc sometimes after making a contribution the cloud takes a moment to enable the new asset
      if (downloadAttempts <= 3) {
        (new Tone.Buffer()).load(url)
          .then(buffer => {
            bufferCache[instance.sample.id] = buffer
            loadTaskCb()
            resolve()
          })
          .catch(error => {
            console.error(error)
            setTimeout(attemptToLoadBuffer.bind(this), 1000 * downloadAttempts)
          })
      } else {
        // @todo log error
        bufferCache[instance.sample.id] = undefined
        loadTaskCb()
        reject(new Error(`Gave up trying to download ${url} after 3 failed attempts.`))
      }
    }

    attemptToLoadBuffer()
  })
}

function syncPlayerToTransport (samplePlayer, playerStartTime, transport = Tone.Transport) {
  transport.schedule(() => {
    samplePlayer.start()
  }, playerStartTime)
}

function addPlayerToTransport (samplePlayer, time, transport = Tone.Transport) {
  const playerStartTime = `0:0:${time}`

  transport.schedule(() => {
    samplePlayer.start()
  }, playerStartTime)
}

function addPluginsToPlayer (samplePlayer, volume, panning) {
  // Plugins
  //
  const panVol = new Tone.PanVol(panning, volume)
  // const limiter = new Tone.Limiter(-6)

  samplePlayer.chain(panVol, /* limiter, */ Tone.Master)
}

function addBufferToTrak (buffer, instance, transport, times) {
  if (times) {
    times.forEach(time => {
      const samplePlayer = new Tone.Player(buffer)

      addPluginsToPlayer(samplePlayer, 0, 0)
        // syncPlayerToTransport(samplePlayer, time, transport)
      addPlayerToTransport(samplePlayer, time, transport)
    })
  } else { /** @todo deprecate the logic in this else block */
    let i = 0

    do {
      const samplePlayer = new Tone.Player(buffer)
      const playerStartTime = instance.startTime + (i * instance.loopPadding)

      addPluginsToPlayer(samplePlayer, instance.volume, instance.panning)
      syncPlayerToTransport(samplePlayer, playerStartTime, transport)
      i++
    } while (i <= (instance.loopCount || 0))
  }
}

function didInstancesCacheMiss (instances) {
  const cachedIds = Object.keys(bufferCache)
  return instances.some(instance => !cachedIds.includes(instance.sample.id))
}

function isBufferCached (buffer) {
  // if buffer doesn't exist, report cached (we don't want to bust cache if buffer doesn't exist bc some views don't use buffer)
  if (!buffer && !cachedStagedBuffer) {
    return true
  }

  return buffer === cachedStagedBuffer
}

function hasStagedSampleChanged (stagedSample) {
  if (!stagedSample) {
    return false
  }

  if (!cachedStagedSample) {
    cachedStagedSample = stagedSample
    return true
  }

  return !isEqual(cachedStagedSample, stagedSample)
}

function isBufferCacheMiss (buffer, stagedSample) {
  const isCacheMiss = !isBufferCached(buffer)
  return isCacheMiss || hasStagedSampleChanged(stagedSample)
}

function getSequencerDuration (sequencerInstance) {
  const timesArray = Object.keys(sequencerInstance.times).map(time => parseInt(time))
  const bufferDuration = sequencerInstance.buffer.get().duration

  const endTimesInSeconds = timesArray.map(time => {
    const startTimeInSeconds = (new Tone.Time(`0:0:${time}`)).toSeconds()
    return startTimeInSeconds + bufferDuration
  })

  endTimesInSeconds.sort((a, b) => a - b)

  return endTimesInSeconds[endTimesInSeconds.length - 1]
}

function getInstancesDuration (instances) {
  const endTimesInSeconds = instances.map(instance => {
    const starts = instance.sequencer_csv.split(',').map(start => parseInt(start))
    const lastStart = starts[starts.length - 1]
    const startTimeInSeconds = (new Tone.Time(`0:0:${lastStart}`)).toSeconds()
    return startTimeInSeconds + instance.sample.duration
  })

  endTimesInSeconds.sort((a, b) => a - b)

  return endTimesInSeconds[endTimesInSeconds.length - 1]
}

function getOfflineTransportduration (instances, sequencerInstance) {
  let sequencerDuration
  let instancesDuration

  if (sequencerInstance) {
    sequencerDuration = getSequencerDuration(sequencerInstance)
  }

  if (instances && instances.length) {
    instancesDuration = getInstancesDuration(instances)
  }

  if (sequencerDuration && instancesDuration) {
    return Math.max(sequencerDuration, instancesDuration)
  } else if (instancesDuration) {
    return instancesDuration
  } else {
    return sequencerDuration
  }
}

/**
 * PUBLIC
 */

class PlaylistRenderer {
  clearCache () {
    bufferCache = {}
    cachedStagedBuffer = undefined
    cachedStagedSample = undefined
  }

  clearPlayer () {
    player = null
  }

  getDuration () {
    return playlistBuffer
      ? playlistBuffer.get().duration
      : null
  }

  getPlayer ({ objectUrlInstance, instances, sequencerInstance, stagedSample, loadTaskCb, fetchTrak }) {
    /**
     * @todo allow for both objectUrl and instances to be on the same player
     */
    if (objectUrlInstance) {
      return new Promise((resolve, reject) => new Tone.Buffer(objectUrlInstance.objectUrl, resolve, reject))
        .then(objectUrlBuffer => {
          const fullDuration = objectUrlInstance.loopCount === 0
            ? objectUrlBuffer.get().duration
            : (objectUrlInstance.loopCount * objectUrlInstance.loopPadding) + objectUrlBuffer.get().duration

          return Tone.Offline(OfflineTransport => {
            OfflineTransport.position = 0

            addBufferToTrak(objectUrlBuffer, objectUrlInstance, OfflineTransport)

            OfflineTransport.start()
          }, fullDuration)
        })
        .then(buffer => {
          playlistBuffer = buffer
          loadTaskCb()
          return new Tone.Player(buffer).toMaster()
        })
    } else {
      const trakAndOrBufferExist = (instances && instances.length) || sequencerInstance

      let areInstancesCacheMiss
      // check isBufferCacheMiss first bc its quicker than checking the instances cache miss
      const cacheMiss = isBufferCacheMiss(sequencerInstance && sequencerInstance.buffer, stagedSample) || (areInstancesCacheMiss = didInstancesCacheMiss(instances))

      // skip all this if
      // 1. this is a trak Fetch (we don't want to cache these) OR
      // 2. the buffers are all cached
      if (fetchTrak || (trakAndOrBufferExist && cacheMiss)) {
        // only fetch instances if the instances aren't cached
        // i.e. a change in `stagedSample` shouldn't require refetching of the instances
        const loadSamplesTask = areInstancesCacheMiss || didInstancesCacheMiss(instances)
          ? Promise.all(instances.map(instance => loadSample(instance, loadTaskCb, fetchTrak)))
          : Promise.resolve()

        return loadSamplesTask.then(() => {
          const offlineTransportDuration = getOfflineTransportduration(instances, sequencerInstance)

          // render audio
          return Tone.Offline(OfflineTransport => {
            OfflineTransport.position = 0

            if (sequencerInstance) {
              cachedStagedBuffer = sequencerInstance.buffer

              const times = Object.keys(sequencerInstance.times).filter(time => sequencerInstance.times[time])

              addBufferToTrak(
                sequencerInstance.buffer,
                stagedSample,
                OfflineTransport,
                times
              )
            }

            instances.forEach(instance => {
              const times = instance.sequencer_csv.split(',')

              addBufferToTrak(bufferCache[instance.sample.id],
                instance,
                OfflineTransport,
                times
              )
            })

            OfflineTransport.start()
          }, offlineTransportDuration)
        })
        .then(buffer => {
          loadTaskCb()
          playlistBuffer = buffer
          // this buffer will be saved to s3 on /staging save action
          trakRenderer.setBuffer(buffer.get())

          player = new Tone.Player(buffer).toMaster()
          return player
        })
      }
    }

    return Promise.resolve(player)
  }
}

export function getPlaylistRenderer () {
  if (!playlistRenderer) {
    playlistRenderer = new PlaylistRenderer()
  }

  return playlistRenderer
}
