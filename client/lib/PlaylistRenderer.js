import Tone from 'tone'

import { instantiateActiveEffect } from './effects'

import config from '../../config'

const baseSampleUrl = config('s3SampleBucket')
const baseTrakUrl = config('s3TrakBucket')

const bufferCache = {}
let playlistRenderer

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

function syncPlayerToTransport (samplePlayer, playerStartTime, transport = Tone.Transport, offset = 0) {
  transport.schedule(() => {
    /**
     * undefined will set the startTime of the player to "now"
     * have to do it this way bc we need to use the second method parameter "offset"
     **/
    samplePlayer.start(undefined, offset)
  }, playerStartTime)
}

function addPlayerToTransport (samplePlayer, time, transport = Tone.Transport) {
  const playerStartTime = `0:0:${time}`

  transport.schedule(() => {
    samplePlayer.start()
  }, playerStartTime)
}



function addPluginsToPlayer (samplePlayer, volume, panning, effects) {
  const panVol = new Tone.PanVol(panning, volume)
  let activeEffect

  if (effects) {
    activeEffect = instantiateActiveEffect(effects)
  }

  if (activeEffect) {
    samplePlayer.chain(activeEffect, panVol, Tone.Master)
  }
  else {
    samplePlayer.chain(panVol, Tone.Master)
  }
}

function addSequencerBufferToTrak (buffer, instance, transport, times) {
  times.forEach(time => {
    const samplePlayer = new Tone.Player(buffer)

    addPluginsToPlayer(samplePlayer, 0, 0)
    addPlayerToTransport(samplePlayer, time, transport)
  })
}

function addCleanupBufferToTrak (buffer, instance, transport, offset = 0, effects) {
  const samplePlayer = new Tone.Player(buffer)
  const playerStartTime = instance.startTime

  addPluginsToPlayer(samplePlayer, instance.volume, instance.panning, effects)
  syncPlayerToTransport(samplePlayer, playerStartTime, transport, offset)
}

function getSequencerDuration (sequencerInstance) {
  const timesArray = Object.keys(sequencerInstance.times)
    .filter(time => sequencerInstance.times[time])
    .map(time => parseInt(time))
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

function addSequencerToTrak (times, buffer, transport) {
  times.forEach(time => {
    const samplePlayer = new Tone.Player(buffer)

    addPluginsToPlayer(samplePlayer, 0, 0)
    addPlayerToTransport(samplePlayer, time, transport)
  })
}

/**
 * PUBLIC
 */

class PlaylistRenderer {
  createCurrentTrakPlayer (instances, completeSpinnerTask) {
    return Promise.all(instances.map(instance => bufferCache[instance.sample.id]
        ? Promise.resolve(completeSpinnerTask())
        : loadSample(instance, completeSpinnerTask, false))
      )
      .then(() => {
        const offlineTransportDuration = getOfflineTransportduration(instances, false)

        // render audio
        return Tone.Offline(OfflineTransport => {
          OfflineTransport.position = 0

          instances.forEach(instance => {
            const times = instance.sequencer_csv.split(',')

            addSequencerBufferToTrak(bufferCache[instance.sample.id],
              instance,
              OfflineTransport,
              times
            )
          })

          OfflineTransport.start()
        }, offlineTransportDuration)
      })
      .then(buffer => {
        completeSpinnerTask(instances.length)
        return new Tone.Player(buffer).toMaster()
      })
  }

  createPlayerFromCleanup (sourceBuffer, cleanupState, completeSpinnerTask, effects) {
    const startTime = cleanupState.sourceDuration * cleanupState.leftSliderValue
    const endTime = cleanupState.sourceDuration * cleanupState.rightSliderValue
    const playerDuration = endTime - startTime

    return Tone.Offline(OfflineTransport => {
      OfflineTransport.position = 0

      addCleanupBufferToTrak(sourceBuffer, {
        startTime: 0,
        panning: cleanupState.panning,
        volume: cleanupState.volume
      }, OfflineTransport, startTime, effects)
      completeSpinnerTask()

      OfflineTransport.start()
    }, playerDuration)
    .then(cleanupBuffer => {
      completeSpinnerTask()
      return new Tone.Player(cleanupBuffer).toMaster()
    })
  }

  createPlayerFromSequencer (selectedSequencerItems, cleanupPlayerBuffer, cleanupState, instances, completeSpinnerTask) {
    return Promise.all(instances.map(instance => bufferCache[instance.sample.id]
      ? Promise.resolve(completeSpinnerTask())
      : loadSample(instance, completeSpinnerTask, false))
    )
      .then(() => {
        completeSpinnerTask()

        const offlineTransportDuration = getOfflineTransportduration(instances,
          { times: selectedSequencerItems, buffer: cleanupPlayerBuffer }
        )

        // render audio
        return Tone.Offline(OfflineTransport => {
          OfflineTransport.position = 0

          const times = Object.keys(selectedSequencerItems).filter(time => selectedSequencerItems[time])

          addSequencerToTrak(times, cleanupPlayerBuffer, OfflineTransport)

          instances.forEach(instance => {
            const times = instance.sequencer_csv.split(',')

            addSequencerBufferToTrak(bufferCache[instance.sample.id],
              instance,
              OfflineTransport,
              times
            )
          })

          OfflineTransport.start()
        }, offlineTransportDuration)
      })
      .then(buffer => {
        completeSpinnerTask()
        return new Tone.Player(buffer).toMaster()
      })
  }

  createFullTrakPlayer (filename, trakId, duration, completeSpinnerTask = () => {}) {
    const instance = {
      sample: {
        url: filename,
        /**
         * @todo investigate using a slidingArray to leverage the PlaylistRenderer cache for the last 5? traks selected
         */
        id: trakId,
        duration
      },
      sequencer_csv: '1'
    }

    return loadSample(instance, completeSpinnerTask, true)
      .then(() => {
        // render audio
        return Tone.Offline(OfflineTransport => {
          OfflineTransport.position = 0

          const times = instance.sequencer_csv.split(',')

          addSequencerBufferToTrak(bufferCache[instance.sample.id],
            instance,
            OfflineTransport,
            times
          )

          OfflineTransport.start()
        }, duration)
      })
      .then(buffer => {
        completeSpinnerTask()
        return new Tone.Player(buffer).toMaster()
      })
  }
}

export function getPlaylistRenderer () {
  if (!playlistRenderer) {
    playlistRenderer = new PlaylistRenderer()
  }

  return playlistRenderer
}
