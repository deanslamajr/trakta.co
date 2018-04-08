import React from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import Tone from 'tone'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import debounce from 'debounce'
import isEqual from 'lodash.isequal'
import axios from 'axios'
import randToken from 'rand-token'

import config from '../../../config'

import * as selectors from '../../../shared/reducers'
import {
  endFetchSample,
  finishLoadTask } from '../../../shared/actions/samples'

import styles from './InstancePlaylist.css'

const baseUrl = config('s3SampleBucket')

const bufferCache = {}

let playCode

function addPluginsToPlayer (samplePlayer, volume, panning) {
  // Plugins
  //
  const panVol = new Tone.PanVol(panning, volume)
  // const limiter = new Tone.Limiter(-6)

  samplePlayer.chain(panVol, /* limiter, */ Tone.Master)
}

function syncPlayerToTransport (samplePlayer, playerStartTime) {
  samplePlayer.sync().start(playerStartTime)
}

/**
 * generate code
 * make request with code
 *
 * @todo have generation salted by app-version-unique secret
 * probably should do this salting (cpu intensive task) in a webWorker
 */
function postStartSignal (trakName) {
  playCode = randToken.generate(16)
  axios.post('/api/play-back', { code: playCode, trakName })
}

function postEndSignal (trakName) {
  axios.post('/api/play-back', { code: playCode, trakName })
}

function playArrangement () {
  Tone.Transport.start()
}
function stopArrangement () {
  Tone.Transport.stop()
}

function prepTransport (trackStartTime, trackLength) {
  Tone.Transport.loop = true
  Tone.Transport.position = Tone.Transport.loopStart = trackStartTime >= 0
    ? trackStartTime
    : 0
  Tone.Transport.loopEnd = trackStartTime >= 0
    ? trackLength + trackStartTime
    : trackLength

  // clear the transport
  Tone.Transport.cancel()

  /** schedule plays POST */
  // Tone.Transport.schedule(function (time) {}, '0')
}

function addBufferToTrak (buffer, instance, trakStartTime) {
  let i = 0
  do {
    const samplePlayer = new Tone.Player(buffer)
    const playerStartTime = (instance.startTime + (i * instance.loopPadding)) - trakStartTime

    addPluginsToPlayer(samplePlayer, instance.volume, instance.panning)
    syncPlayerToTransport(samplePlayer, playerStartTime)
    i++
  } while (i <= (instance.loopCount || 0))
}

class InstancePlaylist extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      error: null
    }

    this._play = this._play.bind(this)
    this._stop = this._stop.bind(this)

    // this debounce slows down invocation just enough so that redux store can be updated properly from form
    this._downloadAndArrangeSampleInstances = this._downloadAndArrangeSampleInstances.bind(this)
    this._debouncedDownloadAndArrangeSampleInstances = debounce(this._downloadAndArrangeSampleInstances, 1000)
  }

  _onInstanceLoadError (instance, reject, error) {
    // @todo log error
    bufferCache[instance.sample.id] = undefined
    this.props.finishLoadTask()
    reject()
  }

  _onInstanceLoadSuccess (instance, resolve) {
    const buffer = bufferCache[instance.sample.id]

    addBufferToTrak(buffer, {
      ...instance,
      loopCount: instance.loop_count,
      loopPadding: instance.loop_padding,
      startTime: instance.start_time
    },
    this.props.trackDimensions.startTime)

    this.props.finishLoadTask()
    resolve()
  }

  _loadSample (instance) {
    return new Promise((resolve, reject) => {
      const url = `${baseUrl}/${instance.sample.url}`
      bufferCache[instance.sample.id] = new Tone.Buffer(
        url,
        this._onInstanceLoadSuccess.bind(this, instance, resolve),
        this._onInstanceLoadError.bind(this, instance, reject)
      )
    })
  }

  _downloadAndArrangeSampleInstances (instances) {
    const {
      buffer,
      stagedSample,
      trackDimensions } = this.props

    const {
      startTime: trackStartTime,
      length: trackLength
    } = trackDimensions

    prepTransport(trackStartTime, trackLength)

    // if buffer exists, add the staged sample to the track
    if (buffer) {
      addBufferToTrak(buffer, stagedSample, trackDimensions.startTime)

      if (!instances || (instances && !instances.length)) {
        // if playback had been engaged:
        // 1. start playback
        // 2. set stop button in navbar
        // else, show playbutton:
        this.props.addItemToNavBar({ type: 'PLAY', cb: this._play })
      }
    }

    if (instances && instances.length) {
      // Load the samples
      const tasks = instances.map(this._loadSample.bind(this))

      return Promise.all(tasks)
        .then(() => {
          this.props.endFetchSample()
          // if playback had been engaged:
          // 1. start playback
          // 2. set stop button in navbar
          // else, show playbutton:
          this.props.addItemToNavBar({ type: 'PLAY', cb: this._play })
        })
        .catch(error => {
          // @todo log error
          console.error(error)
          this.setState({ error })
        })
    } else {
      return Promise.resolve()
    }
  }

  _stopPlaybackAndSendSignal () {
    stopArrangement()
    if (this.props.incrementPlaysCount) {
      postEndSignal(this.props.trakName)
    }
  }

  _stop () {
    this._stopPlaybackAndSendSignal()
    this.setState({ isPlaying: false })
    this.props.addItemToNavBar({ type: 'PLAY', cb: this._play })
  }

  _play () {
    playArrangement()
    if (this.props.incrementPlaysCount) {
      postStartSignal(this.props.trakName)
    }
    this.setState({ isPlaying: true })
    this.props.addItemToNavBar({ type: 'STOP', cb: this._stop })
  }

  componentDidMount () {
    this._downloadAndArrangeSampleInstances(this.props.instances)
  }

  componentWillReceiveProps (nextProps) {
    const instancesHaveChanged = !isEqual(this.props.instances, nextProps.instances)
    const stagedSamplePropsHaveChanged = !isEqual(this.props.stagedSample, nextProps.stagedSample)

    if (instancesHaveChanged || stagedSamplePropsHaveChanged) {
      this.props.addItemToNavBar(null)
      this._stopPlaybackAndSendSignal()
      this._debouncedDownloadAndArrangeSampleInstances(nextProps.instances)
    }
  }

  componentWillUnmount () {
    if (Tone.Transport.state === 'started') {
      this._stopPlaybackAndSendSignal()
    }
  }

  render () {
    if (this.state.error) {
      return this.props.renderErrorComponent(this._downloadAndArrangeSampleInstances.bind(this, this.props.instances))
    }
    return null
  }
}

const mapActionsToProps = {
  endFetchSample,
  finishLoadTask
}

function mapStateToProps (state, ownProps) {
  return {
    isLoading: selectors.isLoading(state),
    instances: selectors.getInstances(state),
    stagedSample: selectors.getStagedSample(state),
    trackDimensions: selectors.getTrackDimensions(state),
    trakName: selectors.getTrakName(state)
  }
}

export default compose(
  withStyles(styles),
  connect(mapStateToProps, mapActionsToProps)
)(InstancePlaylist)
