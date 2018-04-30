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

import { getPlaylistRenderer } from '../../lib/PlaylistRenderer'

import * as selectors from '../../../shared/reducers'
import {
  beginInitialFetch,
  endFetchSample,
  finishLoadTask } from '../../../shared/actions/samples'

import styles from './InstancePlaylist.css'

let playCode
let player // eslint-disable-line
let intervalAnimationId
let position = 0
let cachedStagedBuffer

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

  _renderTrak (instances, stagedSample, trackDimensions) {
    // remove play button
    this.props.addItemToNavBar(null)

    // add task to load animation
    this.props.beginInitialFetch()

    this.playlistRenderer.getPlayer({
      trackDimensions,
      instances,
      buffer: this.props.buffer,
      stagedSample,
      loadTaskCb: this.props.finishLoadTask.bind(this)
    })
      .then(latestPlayer => {
        this._prepTransport()
        player = latestPlayer.sync().start()
        this.props.endFetchSample()
        this.props.addItemToNavBar({ type: 'PLAY', cb: this._play })
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
    this._renderTrak(this.props.instances, this.props.stagedSample, this.props.trackDimensions)
  }

  componentWillReceiveProps (nextProps) {
    const instancesHaveChanged = !isEqual(this.props.instances, nextProps.instances)
    const stagedSamplePropsHaveChanged = !isEqual(this.props.stagedSample, nextProps.stagedSample)

    if (instancesHaveChanged || stagedSamplePropsHaveChanged) {     
      if (Tone.Transport.state === 'started') {
        this._stopPlaybackAndSendSignal()
      }

      this._renderTrak(nextProps.instances, nextProps.stagedSample, nextProps.trackDimensions)
    }
  }

  componentWillUnmount () {
    if (Tone.Transport.state === 'started') {
      this._stopPlaybackAndSendSignal()
    }
    // remove play button
    this.props.addItemToNavBar(null)
  }

  render () {
    return (
      <div>
        {/* {this.state.error && this.props.renderErrorComponent(this._downloadAndArrangeSampleInstances.bind(this, this.props.instances))} */}
        <div ref={ref => { this.playIndicatorEl = ref }} className={styles.playIndicator} />
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
