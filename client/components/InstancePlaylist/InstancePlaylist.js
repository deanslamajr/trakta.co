import React from 'react'
import PropTypes from 'prop-types'
import Tone from 'tone'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import axios from 'axios'
import randToken from 'rand-token'
import viewportDimensions from 'viewport-dimensions'

import { NavButton } from '../../../shared/components/App/AsyncNavBar/AsyncNavBar'

import styles from './InstancePlaylist.css'

let playCode

const animationData = {
  id: null,
  position: 0
}
let intervalAnimationId

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

function startPlayback () {
  Tone.Transport.start()
}
function stopPlayback () {
  Tone.Transport.stop()
}

class InstancePlaylist extends React.Component {
  static propTypes = {
    buttonColor: PropTypes.string,
    incrementPlaysCount: PropTypes.bool,
    playAnimation: PropTypes.func,
    player: PropTypes.object,
    stopAnimation: PropTypes.func,
    trakName: PropTypes.string
  }

  state = {
    activeButton: null,
    isPlaying: false
  }

  _playDefaultAnimation (playbackDurationSeconds, aniData, time) {
    const animationInterval = 20
    const playbackDurationMilliseconds = playbackDurationSeconds * 1000
    const numberOfFrames = (playbackDurationMilliseconds / animationInterval) + 1

    const width = viewportDimensions
      ? viewportDimensions.width() && viewportDimensions.width()
      : 300
    const displacementPerFrame = width / numberOfFrames
    aniData.position = 0

    function drawPosition (playIndicatorEl) {
      aniData.position = aniData.position <= width
        ? aniData.position + displacementPerFrame
        : width
  
      if (playIndicatorEl) {
        playIndicatorEl.style.left = `${aniData.position}px`
      }
    }

    Tone.Draw.schedule(() => {
      this.playIndicatorEl.style.backgroundColor = 'black'

      if (aniData.id) {
        clearInterval(aniData.id)
      }
      // draw first frame of animation
      drawPosition(this.playIndicatorEl)
      // setup interval for the other frames
      aniData.id = setInterval(() => drawPosition(this.playIndicatorEl), animationInterval)
    }, time)
  }

  _stopDefaultAnimation = (aniData) => {
    clearInterval(aniData.id)
    this.playIndicatorEl.style.backgroundColor = 'transparent'
    aniData.position = 0
  }

  _resetTransportAndPrepPlaybackAnimation = (playbackDuration, playAnimation = this._playDefaultAnimation) => {
    // clear the transport
    Tone.Transport.cancel()

    Tone.Transport.loop = true
    Tone.Transport.position = 0
    Tone.Transport.loopEnd = playbackDuration

    Tone.Transport.schedule(playAnimation.bind(this, playbackDuration, animationData), 0)
  }

  _stop = () => {
    const stopAnimation = this.props.stopAnimation || this._stopDefaultAnimation
    stopAnimation(animationData)    
    
    stopPlayback()

    this.setState({
      activeButton: 'PLAY',
      isPlaying: false
    })

    if (this.props.incrementPlaysCount) {
      postEndSignal(this.props.trakName)
    }
  }

  _play = () => {
    startPlayback()

    this.setState({
      activeButton: 'STOP',
      isPlaying: true
    })

    if (this.props.incrementPlaysCount) {
      postStartSignal(this.props.trakName)
    }
  }

  _finishPlayerInit = (player) => {
    player.sync().start()
    /**
     * Show the play button
     * If old player had been playing when new player arrived, don't change the activeButton
     */
    if (!this.state.isPlaying) {
      this.setState({ activeButton: 'PLAY' })
    }
  }

  _initializePlayer = (player, playAnimation) => {
    if (player) {
      this._resetTransportAndPrepPlaybackAnimation(player.buffer.get().duration, playAnimation)
      this._finishPlayerInit(player)
    }
  }

  componentWillReceiveProps (nextProps) {
    const playerHasChanged = this.props.player !== nextProps.player
    const animationsHaveChanged = this.props.playAnimation !== nextProps.playAnimation ||
      this.props.stopAnimation !== nextProps.stopAnimation
    
    if (playerHasChanged || animationsHaveChanged) {
      this._initializePlayer(nextProps.player, nextProps.playAnimation)
    }
  }

  componentDidMount () {
    this._initializePlayer(this.props.player, this.props.playAnimation)
  }

  componentWillUnmount () {
    if (Tone.Transport.state === 'started') {
      this._stop()
    }
  }

  render () {
    const { activeButton } = this.state

    return (
      <React.Fragment>
        <div ref={ref => { this.playIndicatorEl = ref }} className={styles.playIndicator} />
        {
          activeButton === 'PLAY' && (
            <NavButton
              type={'PLAY'}
              cb={this._play}
              color={this.props.buttonColor}
              position={'TOP_RIGHT'}
            />
          )
        }
        {
          activeButton === 'STOP' && (
            <NavButton
              type={'STOP'}
              cb={this._stop}
              color={this.props.buttonColor}
              position={'TOP_RIGHT'}
            />
          )
        }
      </React.Fragment>
    )
  }
}

export default withStyles(styles)(InstancePlaylist)
