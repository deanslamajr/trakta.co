import React from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import ReactSlider from 'react-slider'
import classnames from 'classnames'

import * as selectors from '../../../shared/reducers'
import {
  setStagedObjectUrl,
  setCleanup } from '../../../shared/actions/recorder'

import { getSampleCreator } from '../../lib/SampleCreator'

import styles from './cleanup.css'

let audioElement
let intervalAnimationId
let position
let onEndPlaybackLoop

function stopPlayback () {
  audioElement.pause()
  audioElement.currentTime = 0.0
}

function getMainEditUrl (url) {
  return url.replace('/cleanup', '')
}

class Cleanup extends React.Component {
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
      isPlaying: false,
      duration: 0,
      isFirstRender: true
    }

    this._onLeftSliderChange = this._onLeftSliderChange.bind(this)
    this._onLeftSliderFinish = this._onLeftSliderFinish.bind(this)
    this._onRightSliderChange = this._onRightSliderChange.bind(this)
    this._onRightSliderFinish = this._onRightSliderFinish.bind(this)
    this._startPlayback = this._startPlayback.bind(this)
    this._stopPlayback = this._stopPlayback.bind(this)
    this._clickUseThisSelection = this._clickUseThisSelection.bind(this)
    this._renderSample = this._renderSample.bind(this)
    this._onEndPlaybackLoop = this._onEndPlaybackLoop.bind(this)
  }

  _clickUseThisSelection () {
    const mainEditUrl = getMainEditUrl(this.props.match.path)

    this.props.history.push(`${mainEditUrl}/staging`)
  }

  _renderSample (start, stop) {
    const objectUrl = this.sampleCreator.clipBlobAndReturnObjectUrl(start, stop)

    audioElement = new Audio([objectUrl]) // eslint-disable-line

    this.props.setStagedObjectUrl(objectUrl)
  }

  _drawWaveForm () {
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

  _stopPlayback () {
    stopPlayback()
    audioElement.removeEventListener('ended', onEndPlaybackLoop)
    audioElement._isPlaying = false
    clearInterval(intervalAnimationId)
    this.playIndicatorEl.style.backgroundColor = 'transparent'

    this.setState({ isPlaying: false }, () => {
      this.props.addItemToNavBar({
        BOTTOM_RIGHT: { type: 'PLAY', cb: this._startPlayback }
      }, true)
    })
  }

  _redrawPosition (bottom, displacementPerFrame, top) {
    position = position <= bottom
      ? position + displacementPerFrame
      : bottom

    if (this.playIndicatorEl) {
      this.playIndicatorEl.style.top = `${position}px`
    }
  }

  _onEndPlaybackLoop (top, bottom, displacementPerFrame, animationInterval) {
    clearInterval(intervalAnimationId)
    this.playIndicatorEl.style.backgroundColor = 'transparent'
    if (audioElement._isPlaying) {
      this._startPlaybackAudioAndAnimation(top, bottom, displacementPerFrame, animationInterval)
    }
  }

  _startPlaybackAudioAndAnimation (top, bottom, displacementPerFrame, animationInterval) {
    position = top

    audioElement.addEventListener('play', () => {
      if (this.playIndicatorEl) {
        this.playIndicatorEl.style.backgroundColor = 'black'
      }

      const redrawPosition = this._redrawPosition.bind(this)
      onEndPlaybackLoop = this._onEndPlaybackLoop.bind(this, top, bottom, displacementPerFrame, animationInterval)

      redrawPosition(bottom, displacementPerFrame, top)

      intervalAnimationId = setInterval(() => redrawPosition(bottom, displacementPerFrame, top), animationInterval)

      audioElement.addEventListener('ended', onEndPlaybackLoop, { once: true })
    },
    { once: true })

    audioElement.play()
    audioElement._isPlaying = true
  }

  _startPlayback () {
    this.props.addItemToNavBar({
      BOTTOM_RIGHT: { type: 'STOP', cb: this._stopPlayback }
    }, true)

    const maxClipValue = this.sampleCreator.getDataBufferLength()
    const top = this.state.canvasHeight * (this.props.cleanup.leftSliderValue / maxClipValue)
    const bottom = this.state.canvasHeight * (this.props.cleanup.rightSliderValue / maxClipValue)
    const animationDistance = bottom - top

    const animationInterval = 20
    const sampleDuration = audioElement.duration * 1000
    const numberOfFrames = (sampleDuration / animationInterval) + 1

    const displacementPerFrame = animationDistance / numberOfFrames

    this.setState({
      isPlaying: true,
      duration: audioElement.duration
    }, () => this._startPlaybackAudioAndAnimation(top, bottom, displacementPerFrame, animationInterval))
  }

  _onLeftSliderChange (value) {
    this.props.setCleanup({ leftSliderValue: value })
  }

  _onRightSliderChange (value) {
    this.props.setCleanup({ rightSliderValue: value })
  }

  _onLeftSliderFinish (value) {
    this.props.setCleanup({
      clipStart: value,
      leftSliderValue: value
    })
  }

  _onRightSliderFinish (value) {
    this.props.setCleanup({
      clipEnd: value,
      rightSliderValue: value
    })
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.cleanup.clipStart !== nextProps.cleanup.clipStart || this.props.cleanup.clipEnd !== nextProps.cleanup.clipEnd) {
      if (this.state.isPlaying) {
        this._stopPlayback()
      }
      this._renderSample(nextProps.cleanup.clipStart, nextProps.cleanup.clipEnd)
    }
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
          this._renderSample(this.props.cleanup.clipStart, this.props.cleanup.clipEnd)

          const mainEditUrl = getMainEditUrl(this.props.match.url)
          
          this.props.addItemToNavBar({
            TOP_LEFT: { type: 'BACK', cb: () => this.props.history.push(`${mainEditUrl}/recorder`) },
            TOP_RIGHT: { type: 'CHECK', cb: this._clickUseThisSelection },
            BOTTOM_RIGHT: { type: 'PLAY', cb: this._startPlayback }
          })
        }
      })
    }
  }

  componentWillUnmount () {
    if (this.state.isPlaying) {
      this._stopPlayback()
    }
  }

  render () {
    const maxClipValue = this.sampleCreator.getDataBufferLength()
    const stepValue = Math.ceil(maxClipValue / 1000)

    const top = this.state.canvasHeight * (this.props.cleanup.leftSliderValue / maxClipValue)
    const bottom = this.state.canvasHeight - (this.state.canvasHeight * (this.props.cleanup.rightSliderValue / maxClipValue))

    return (
      <div ref={(container) => { this.container = container }}>
        <div className={styles.label}>
          {
            this.props.objectUrl &&
            (
              <div>
                <div>
                  <ReactSlider
                    orientation='vertical'
                    className={styles.sliderLeft}
                    handleClassName={classnames(styles.leftHandle, styles.handle)}
                    onChange={this._onLeftSliderChange}
                    max={maxClipValue}
                    step={stepValue}
                    onAfterChange={this._onLeftSliderFinish}
                    defaultValue={this.props.cleanup.clipStart}
                  />
                  <ReactSlider
                    orientation='vertical'
                    className={styles.sliderRight}
                    handleClassName={classnames(styles.rightHandle, styles.handle)}
                    onChange={this._onRightSliderChange}
                    max={maxClipValue}
                    step={stepValue}
                    onAfterChange={this._onRightSliderFinish}
                    defaultValue={this.props.cleanup.clipEnd}
                  />
                </div>

                <canvas
                  className={styles.canvas}
                  width={this.state.canvasWidth || 0}
                  height={this.state.canvasHeight || 0}
                  ref={(canvas) => { this.canvas = canvas }}
                />
                <div style={{ top: `${top}px`, bottom: `${bottom}px` }} className={styles.canvasMask} />
                <div ref={(ref) => { this.playIndicatorEl = ref }} className={styles.playIndicator} />
              </div>
            )
          }
        </div>
      </div>
    )
  }
}

const mapActionsToProps = {
  setStagedObjectUrl,
  setCleanup
}

function mapStateToProps (state) {
  return {
    objectUrl: selectors.getStagedObjectUrl(state),
    cleanup: selectors.getCleanup(state)
  }
}

export default compose(
  withStyles(styles),
  connect(mapStateToProps, mapActionsToProps)
)(Cleanup)
