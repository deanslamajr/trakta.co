import React from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import Tone from 'tone'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import debounce from 'debounce'
import isEqual from 'lodash.isequal'
import axios from 'axios'
import randToken from 'rand-token'
import viewportDimensions from 'viewport-dimensions'

import config from '../../../config'

import * as selectors from '../../../shared/reducers'
import {
  beginInitialFetch,
  endFetchSample,
  finishLoadTask } from '../../../shared/actions/samples'

import styles from './InstancePlaylist.css'

const baseUrl = config('s3SampleBucket')

const bufferCache = {}

let player
let playCode
let intervalAnimationId
let position = 0


function addPluginsToPlayer (samplePlayer, volume, panning) {
  // Plugins
  //
  const panVol = new Tone.PanVol(panning, volume)
  // const limiter = new Tone.Limiter(-6)

  samplePlayer.chain(panVol, /* limiter, */ Tone.Master)
}

function syncPlayerToTransport (samplePlayer, playerStartTime, transport = Tone.Transport) {
  transport.schedule(() => {
    samplePlayer.start()
  }, playerStartTime)
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

function addBufferToTrak (buffer, instance, trakStartTime, transport) {
  let i = 0
  do {
    const samplePlayer = new Tone.Player(buffer)
    const playerStartTime = (instance.startTime + (i * instance.loopPadding)) - trakStartTime

    addPluginsToPlayer(samplePlayer, instance.volume, instance.panning)
    syncPlayerToTransport(samplePlayer, playerStartTime, transport)
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
    this._renderTrak = this._renderTrak.bind(this)
    this._debouncedRenderTrak = debounce(this._renderTrak, 1000)
  }

  _onInstanceLoadError (instance, reject, error) {
    // @todo log error
    bufferCache[instance.sample.id] = undefined
    this.props.finishLoadTask()
    reject()
  }

  _loadSample (instance) {
    return new Promise((resolve, reject) => {
      const url = `${baseUrl}/${instance.sample.url}`
      bufferCache[instance.sample.id] = new Tone.Buffer(
        url,
        () => {
          this.props.finishLoadTask()
          resolve()
        },
        this._onInstanceLoadError.bind(this, instance, reject)
      )
    })
  }

  _drawPosition (displacementPerFrame, endPosition) {
    position = position <= endPosition
      ? position + displacementPerFrame
      : endPosition

    if (this.playIndicatorEl) {
      this.playIndicatorEl.style.left = `${position}px`
    }
  }

  _prepTransport () {
    const { length: trakDuration } = this.props.trackDimensions
    const width = viewportDimensions
      ? viewportDimensions.width() && viewportDimensions.width()
      : 300

    const animationInterval = 20
    const sampleDuration = trakDuration * 1000
    const numberOfFrames = (sampleDuration / animationInterval) + 1

    const displacementPerFrame = width / numberOfFrames

    // clear the transport
    Tone.Transport.cancel()

    Tone.Transport.loop = true
    Tone.Transport.position = 0
    Tone.Transport.loopEnd = trakDuration
  
    Tone.Transport.schedule((time) => {
      Tone.Draw.schedule(() => {
        position = 0
        this.playIndicatorEl.style.backgroundColor = 'black'
        clearInterval(intervalAnimationId)
        // draw first frame of animation
        this._drawPosition(displacementPerFrame, width)
        // setup interval for the other frames
        intervalAnimationId = setInterval(() => this._drawPosition(displacementPerFrame, width), animationInterval)
  
      }, time)
    }, 0)
  }

  _renderTrak (instances) {
    const {
      buffer,
      stagedSample,
      trackDimensions } = this.props

    const {
      startTime: trackStartTime,
      length: trackLength
    } = trackDimensions

    if (trackLength && instances && instances.length || buffer) {
      // Load the samples
      Promise.all(instances.map(instance => this._loadSample(instance)))
        .then(() => {
          return Tone.Offline(OfflineTransport => {
            // add task to load animation
            this.props.beginInitialFetch()

            OfflineTransport.position = trackStartTime >= 0
              ? trackStartTime
              : 0
      
            // if buffer exists, add the staged sample to the track
            if (buffer) {
              addBufferToTrak(buffer, stagedSample, trackStartTime, OfflineTransport)
            }
      
            instances.forEach(instance => {
              addBufferToTrak(bufferCache[instance.sample.id], {
                ...instance,
                loopCount: instance.loop_count,
                loopPadding: instance.loop_padding,
                startTime: instance.start_time
              },
              this.props.trackDimensions.startTime,
              OfflineTransport)
            })
    
            OfflineTransport.start()
          }, trackLength || buffer.get().duration)
        })
        .then(buffer => {
          this.props.finishLoadTask()
          return new Tone.Player(buffer).toMaster()
        })
        .then(latestPlayer => {
          this._prepTransport()
          player = latestPlayer.sync().start()
          this.props.endFetchSample()
          this.props.addItemToNavBar({ type: 'PLAY', cb: this._play })
        })
        .catch(error => {
          // @todo log error
          console.error(error)
          this.setState({ error })
        })
    }
  }

  _stopPlaybackAndSendSignal () {
    clearInterval(intervalAnimationId)
    this.playIndicatorEl.style.backgroundColor = 'transparent'
    position = 0
    stopArrangement()
    this.setState({ isPlaying: false })
    if (this.props.incrementPlaysCount) {
      postEndSignal(this.props.trakName)
    }
  }

  _stop () {
    this._stopPlaybackAndSendSignal()
    this.props.addItemToNavBar({ type: 'PLAY', cb: this._play })
  }

  _play () {
    playArrangement()
    
    this.setState({ isPlaying: true })
    this.props.addItemToNavBar({ type: 'STOP', cb: this._stop })
    if (this.props.incrementPlaysCount) {
      postStartSignal(this.props.trakName)
    }
  }

  componentDidMount () {
    this._renderTrak(this.props.instances)
  }

  componentWillReceiveProps (nextProps) {
    const instancesHaveChanged = !isEqual(this.props.instances, nextProps.instances)
    const stagedSamplePropsHaveChanged = !isEqual(this.props.stagedSample, nextProps.stagedSample)

    if (instancesHaveChanged || stagedSamplePropsHaveChanged) {
      this.props.addItemToNavBar(null)
      this._stopPlaybackAndSendSignal()
      this._debouncedRenderTrak(nextProps.instances)
    }
  }

  componentWillUnmount () {
    if (Tone.Transport.state === 'started') {
      this._stopPlaybackAndSendSignal()
    }
  }

  render () {
    return (
      <div>
        {/* {this.state.error && this.props.renderErrorComponent(this._downloadAndArrangeSampleInstances.bind(this, this.props.instances))} */}
        <div ref={ref => this.playIndicatorEl = ref} className={styles.playIndicator} />
      </div>
    )
  }
}

const mapActionsToProps = {
  endFetchSample,
  beginInitialFetch,
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
