import React from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import Tone from 'tone'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import isEqual from 'lodash.isequal'
import axios from 'axios'
import randToken from 'rand-token'
import viewportDimensions from 'viewport-dimensions'

import { getPlaylistRenderer } from '../../lib/PlaylistRenderer'
import { getTrakRenderer } from '../../lib/TrakRenderer'

import * as selectors from '../../../shared/reducers'
import {
  beginInitialFetch,
  endFetchSample,
  finishLoadTask } from '../../../shared/actions/samples'
import {
  setStagedObjectUrl,
  setStagedSample
} from '../../../shared/actions/recorder'

import styles from './InstancePlaylist.css'

let playCode
let player // eslint-disable-line
let intervalAnimationId
let position = 0

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

class InstancePlaylist extends React.Component {
  constructor (props) {
    super(props)

    this.playlistRenderer = getPlaylistRenderer()
    this.getTrakRenderer = getTrakRenderer()

    this.state = {
      error: null
    }

    this._play = this._play.bind(this)
    this._stop = this._stop.bind(this)
    this._renderTrak = this._renderTrak.bind(this)
  }

  _drawPosition (displacementPerFrame, endPosition) {
    position = position <= endPosition
      ? position + displacementPerFrame
      : endPosition

    if (this.playIndicatorEl) {
      this.playIndicatorEl.style.left = `${position}px`
    }
  }

  _prepTransport (trakDuration) {
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

  _renderTrak (instances, stagedSample, trackDimensions, objectUrlInstance, sequencerInstance) {
    // remove play button
    this.props.addItemToNavBar({
      TOP_RIGHT: {
        type: 'LOADING',
        color: this.props.buttonColor
      }
    }, true)

    // add task to load animation
    this.props.beginInitialFetch()

    this.playlistRenderer.getPlayer({
      objectUrlInstance,
      instances,
      sequencerInstance,
      stagedSample,
      loadTaskCb: this.props.finishLoadTask.bind(this),
      fetchTrak: this.props.fetchTrak
    })
      .then(latestPlayer => {
        this.props.endFetchSample()

        if (latestPlayer) {
          this._prepTransport(latestPlayer.buffer.get().duration)

          if (this.props.saveObjectUrl) {
            const objectUrl = this.getTrakRenderer.createObjectUrlFromBuffer(latestPlayer.buffer)
            this.props.setStagedObjectUrl(objectUrl)
          }

          player = latestPlayer.sync().start()
          this.props.addItemToNavBar({
            TOP_RIGHT: {
              type: 'PLAY',
              cb: this._play,
              color: this.props.buttonColor
            }
          }, true)
        } else {
          this.props.addItemToNavBar({
            TOP_RIGHT: null
          }, true)
        }
      })
      .catch(error => {
        // @todo show an error view with a retry action
        console.error(error)
        this.setState({ error })
      })
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
    this.props.addItemToNavBar({
      TOP_RIGHT: {
        type: 'PLAY',
        cb: this._play,
        color: this.props.buttonColor
      }
    }, true)
  }

  _play () {
    playArrangement()

    this.setState({ isPlaying: true })
    this.props.addItemToNavBar({
      TOP_RIGHT: {
        type: 'STOP',
        cb: this._stop,
        color: this.props.buttonColor
      }
    }, true)
    if (this.props.incrementPlaysCount) {
      postStartSignal(this.props.trakName)
    }
  }

  componentDidMount () {
    this._renderTrak(this.props.instances, this.props.stagedSample, this.props.trackDimensions, this.props.objectUrlInstance, this.props.sequencerInstance)
  }

  componentWillReceiveProps (nextProps) {
    const instancesHaveChanged = !isEqual(this.props.instances, nextProps.instances)
    const stagedSamplePropsHaveChanged = !isEqual(this.props.stagedSample, nextProps.stagedSample)
    const objectUrlInstanceHasChanged = !isEqual(this.props.objectUrlInstance, nextProps.objectUrlInstance)
    const trackDimensionsHasChanged = !isEqual(this.props.trackDimensions, nextProps.trackDimensions)

    const sequencerTimesHaveChanged = this.props.sequencerInstance
      ? !isEqual(this.props.sequencerInstance.times, nextProps.sequencerInstance.times)
      : false

    if (instancesHaveChanged ||
      stagedSamplePropsHaveChanged ||
      objectUrlInstanceHasChanged ||
      trackDimensionsHasChanged ||
      sequencerTimesHaveChanged
    ) {
      if (Tone.Transport.state === 'started') {
        this._stopPlaybackAndSendSignal()
      }

      this._renderTrak(nextProps.instances, nextProps.stagedSample, nextProps.trackDimensions, nextProps.objectUrlInstance, nextProps.sequencerInstance)
    }
  }

  componentWillUnmount () {
    if (Tone.Transport.state === 'started') {
      this._stopPlaybackAndSendSignal()
    }

    this.props.addItemToNavBar({
      TOP_RIGHT: null
    }, true)
  }

  render () {
    return (
      <div ref={ref => { this.playIndicatorEl = ref }} className={styles.playIndicator} />
    )
  }
}

const mapActionsToProps = {
  endFetchSample,
  beginInitialFetch,
  finishLoadTask,
  setStagedObjectUrl,
  setStagedSample
}

function mapStateToProps (state, ownProps) {
  return {
    isLoading: selectors.isLoading(state),
    stagedSample: selectors.getStagedSample(state),
    trakName: selectors.getTrakName(state)
  }
}

export default compose(
  withStyles(styles),
  connect(mapStateToProps, mapActionsToProps)
)(InstancePlaylist)
