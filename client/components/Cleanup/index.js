import React from 'react'
import PropTypes from 'prop-types'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import ReactSlider from 'react-slider'
import classnames from 'classnames'
import Helmet from 'react-helmet'

import { NavButton } from '../../../shared/components/App/AsyncNavBar/AsyncNavBar'
import EffectsModal from './EffectsModal'

import { getSampleCreator } from '../../lib/SampleCreator'

import config from '../../../config'

import styles from './cleanup.css'

function getMainEditUrl (url) {
  return url.replace('/cleanup', '')
}

class Cleanup extends React.Component {
  static propTypes = {
    cleanupState: PropTypes.object,
    clearActivePlayer: PropTypes.func,
    createPlayerFromCleanup: PropTypes.func,
    createPlayerFromCleanupWithEffect: PropTypes.func,
    effects: PropTypes.array,
    history: PropTypes.object,
    setCleanupState: PropTypes.func,
    setPlayerAnimations: PropTypes.func,
    trakName: PropTypes.string
  }

  constructor (props) {
    super(props)

    try {
      this.sampleCreator = getSampleCreator()
    } catch (error) {
      // Tone.UserMedia is not supported
      // @todo catch this earlier
      console.error(error)
    }

    this.state = {
      showVolumeSlider: false,
      showEffectsModal: false
    }
  }

  _clickUseThisSelection = () => {
    const mainEditUrl = getMainEditUrl(this.props.match.path)

    this.props.history.push(`${mainEditUrl}/sequencer`)
  }

  _drawWaveForm = () => {
    const canvasWidth = this.canvasContext.canvas.width
    const canvasHeight = this.canvasContext.canvas.height

    let x

    // draw the waveform
    const values = this.sampleCreator.getReducedSet(this.state.canvasHeight)

    this.canvasContext.beginPath()
    this.canvasContext.clearRect(0, 0, canvasWidth, canvasHeight)
    this.canvasContext.lineJoin = 'round'
    this.canvasContext.lineWidth = 1
    this.canvasContext.strokeStyle = '#CCCCCC'

    this.canvasContext.moveTo((values[0] / 255) * canvasWidth, canvasHeight)

    for (let i = values.length; i > 0; i--) {
      const val = values[i] / (this.sampleCreator.resolution - 1)
      x = val * canvasWidth
      this.canvasContext.lineTo(x, i)
    }

    this.canvasContext.stroke()
    this.canvasContext.closePath()
  }

  _toggleVolumeSlider = () => {
    this.setState({ showVolumeSlider: !this.state.showVolumeSlider })
  }

  _toggleEffectsModal = () => {
    this.setState({ showEffectsModal: !this.state.showEffectsModal })
  }

  _onVolumeSliderFinish = (value) => {
    /** fix for slider being upside down */
    const volume = value * -1

    this.props.createPlayerFromCleanup({ volume })
  }

  _onLeftSliderChange = (value) => {
    this.props.setCleanupState({ leftSliderValue: value })
  }

  _onRightSliderChange = (value) => {
    this.props.setCleanupState({ rightSliderValue: value })
  }

  _createPlaybackAnimation = () => {
    const top = this.state.canvasHeight * this.props.cleanupState.leftSliderValue
    const bottom = this.state.canvasHeight * this.props.cleanupState.rightSliderValue
    const trakHeight = bottom - top
    
    return this._getInstancesPlaybackAnimation(top, trakHeight)
  }

  _onLeftSliderFinish = (value) => {
    const playAnimation = this._createPlaybackAnimation()    

    this.props.createPlayerFromCleanup({ leftSliderValue: value }, {
      playAnimation,
      stopAnimation: this._stopAnimation
    })
  }

  _onRightSliderFinish = (value) => {
    const playAnimation = this._createPlaybackAnimation() 

    this.props.createPlayerFromCleanup({ rightSliderValue: value }, {
      playAnimation,
      stopAnimation: this._stopAnimation
    })
  }

  _handleBackAction = () => {
    const mainEditUrl = getMainEditUrl(this.props.match.url)
    this.props.clearActivePlayer()
    this.props.history.push(`${mainEditUrl}/recorder`)
  }

  _stopAnimation = (aniData) => {
    clearInterval(aniData.id)
    if (this.playIndicatorEl) {
      this.playIndicatorEl.setAttribute('stroke', 'transparent')
    }
    aniData.position = 0
  }

  _getInstancesPlaybackAnimation = (startYPosition, trakHeight) => (playbackDurationSeconds, aniData, time) => {
    const animationInterval = 40
    const playbackDurationMilliseconds = playbackDurationSeconds * 1000
    const numberOfFrames = (playbackDurationMilliseconds / animationInterval)

    const displacementPerFrame = trakHeight / numberOfFrames
    aniData.position = 0

    function drawPosition (playIndicatorEl) {
      aniData.position = aniData.position <= trakHeight
        ? aniData.position + displacementPerFrame
        : trakHeight
  
      if (playIndicatorEl) {
        playIndicatorEl.setAttribute('y1', aniData.position + startYPosition)
        playIndicatorEl.setAttribute('y2', aniData.position + startYPosition)
      }
    }

    const Tone = require('tone')

    if (this.playIndicatorEl) {
      this.playIndicatorEl.setAttribute('stroke', 'black')
    }

    if (aniData.id) {
      clearInterval(aniData.id)
    }
    // draw first frame of animation
    drawPosition(this.playIndicatorEl)
    // setup interval for the other frames
    aniData.id = setInterval(() => drawPosition(this.playIndicatorEl), animationInterval)
  }

  componentDidMount () {
    const height = this.container
        ? this.container.parentNode.clientHeight
        : 0
    const width = this.container
        ? this.container.parentNode.clientWidth
        : 0

    // if this component has unmounted by now (e.g. pressing back button quickly, go(-3) at end of creation)
    // don't do this stuff
    if (this.canvas) {
      this.setState({
        canvasWidth: width * 0.7,
        canvasHeight: height
      }, () => {
        // if this component has unmounted by now (e.g. pressing back button quickly, go(-3) at end of creation)
        // don't do this stuff
        if (this.canvas) {
          this.canvasContext = this.canvas.getContext('2d')

          // @todo have these resize with window resize
          this.canvasContext.canvas.width = this.state.canvasWidth
          this.canvasContext.canvas.height = this.state.canvasHeight

          this._drawWaveForm()

          const playAnimation = this._createPlaybackAnimation() 
          this.props.createPlayerFromCleanup({}, {
            playAnimation,
            stopAnimation: this._stopAnimation
          })
        }
      })
    }
  }

  render () {
    const top = this.state.canvasHeight * this.props.cleanupState.leftSliderValue
    const bottom = this.state.canvasHeight - (this.state.canvasHeight * this.props.cleanupState.rightSliderValue)

    return (
      <div ref={(container) => { this.container = container }}>
        <Helmet>
          <title>{`${this.props.trakName} - cleanup - ${config('appTitle')}`}</title>
        </Helmet>
        <div className={styles.label}>
          {
            <div>
              {/* WAVEFORM */}
              <canvas
                className={styles.canvas}
                width={this.state.canvasWidth || 0}
                height={this.state.canvasHeight || 0}
                ref={(canvas) => { this.canvas = canvas }}
              />
              {/* PLAYBACK INDICATER */}
              <svg
                className={styles.canvas}
                width={this.state.canvasWidth || 0}
                height={this.state.canvasHeight || 0}
              >
                <line
                  x1='0'
                  x2={this.state.canvasWidth || 0}
                  ref={ref => { this.playIndicatorEl = ref }}
                />
              </svg>
              {/* CLEANUP SECTION INDICATER */}
              <div style={{ top: `${top}px`, bottom: `${bottom}px` }} className={styles.canvasMask} />

              <div>
                <ReactSlider
                  orientation='vertical'
                  className={styles.sliderLeft}
                  handleClassName={classnames(styles.leftHandle, styles.handle)}
                  min={0}
                  max={1}
                  step={0.0025}
                  onChange={this._onLeftSliderChange}
                  onAfterChange={this._onLeftSliderFinish}
                  defaultValue={this.props.cleanupState.leftSliderValue}
                />
                <ReactSlider
                  orientation='vertical'
                  className={styles.sliderRight}
                  handleClassName={classnames(styles.rightHandle, styles.handle)}
                  min={0}
                  max={1}
                  step={0.0025}
                  onChange={this._onRightSliderChange}
                  onAfterChange={this._onRightSliderFinish}
                  defaultValue={this.props.cleanupState.rightSliderValue}
                />
              </div>

              {
                this.state.showVolumeSlider && (
                  <ReactSlider
                    orientation='vertical'
                    className={styles.volumeSlider}
                    handleClassName={styles.volumeSliderHandle}
                    max={20}
                    min={-20}
                    step={0.5}
                    onAfterChange={this._onVolumeSliderFinish}
                    defaultValue={this.props.cleanupState.volume * -1}
                  />
                )
              }

              {this.state.showEffectsModal && (
                <EffectsModal 
                  createPlayerFromCleanup={this.props.createPlayerFromCleanup}
                  createPlayerFromCleanupWithEffect={this.props.createPlayerFromCleanupWithEffect}
                  clipDuration={this.props.cleanupState.clipDuration}
                  effects={this.props.effects}
                  loopCount={this.props.cleanupState.loopCount}
                  loopPadding={this.props.cleanupState.loopPadding}
                />
              )}
            </div>
          }
        </div>

        <NavButton
          type={'BACK'}
          cb={this._handleBackAction}
          position={'TOP_LEFT'}
        />
        <NavButton
          type={'CHECK'}
          cb={this._clickUseThisSelection}
          position={'BOTTOM_RIGHT'}
        />
        <NavButton
          type={'VOLUME'}
          cb={this._toggleVolumeSlider}
          position={'BOTTOM_LEFT'}
        />
        <NavButton
          type={'MENU'}
          cb={this._toggleEffectsModal}
          position={'BOTTOM_CENTER'}
        />
      </div>
    )
  }
}

export default withStyles(styles)(Cleanup)
