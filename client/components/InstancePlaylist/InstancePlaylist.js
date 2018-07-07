import React from 'react'
import PropTypes from 'prop-types'
import Tone from 'tone'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import axios from 'axios'
import randToken from 'rand-token'
import viewportDimensions from 'viewport-dimensions'

import styles from './InstancePlaylist.css'

let playCode
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

    this._initializePlayer(this.props.player)
  }

  _drawPosition = (displacementPerFrame, endPosition) => {
    position = position <= endPosition
      ? position + displacementPerFrame
      : endPosition

    if (this.playIndicatorEl) {
      this.playIndicatorEl.style.left = `${position}px`
    }
  }

  _prepTransport = (trakDuration) => {
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

  _finishPlayerInit = (player) => {
    player.sync().start()
    this.props.addItemToNavBar({
      TOP_RIGHT: {
        type: 'PLAY',
        cb: this._play,
        color: this.props.buttonColor
      }
    }, true)
  }

  _stopPlaybackAndSendSignal = () => {
    clearInterval(intervalAnimationId)
    this.playIndicatorEl.style.backgroundColor = 'transparent'
    position = 0
    stopArrangement()
    this.setState({ isPlaying: false })
    if (this.props.incrementPlaysCount) {
      postEndSignal(this.props.trakName)
    }
  }

  _stop = () => {
    this._stopPlaybackAndSendSignal()
    this.props.addItemToNavBar({
      TOP_RIGHT: {
        type: 'PLAY',
        cb: this._play,
        color: this.props.buttonColor
      }
    }, true)
  }

  _play = () => {
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

  _initializePlayer = (player) => {
    if (player) {
      /**
       * @todo is player is playing, stop old player and start new player
       */
      this._prepTransport(player.buffer.get().duration)
      this._finishPlayerInit(player)
    }
  }

  componentWillReceiveProps (nextProps) {
    const playerHasChanged = this.props.player !== nextProps.player
    if (playerHasChanged) {
      this._initializePlayer(nextProps.player)
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

InstancePlaylist.propTypes = {
  addItemToNavBar: PropTypes.func.required,
  incrementPlaysCount: PropTypes.bool,
  player: PropTypes.required,
  trakName: PropTypes.string.required
}

export default withStyles(styles)(InstancePlaylist)
