import React from 'react'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import ReactSlider from 'react-slider'
import classnames from 'classnames'

import InstancePlaylist from '../InstancePlaylist'

import * as selectors from '../../../shared/reducers'
import { updateDimensionsWithAdditionalSample } from '../../../shared/actions/trak'
import {
  setStagedSample,
} from '../../../shared/actions/recorder'

import { getSampleCreator } from '../../lib/SampleCreator'

import styles from './cleanup.css'

const maxLoopCount = 30

function getMainEditUrl (url) {
  return url.replace('/cleanup', '')
}

class Cleanup extends React.Component {
  static propTypes = {
    cleanupState: PropTypes.object,
    createPlayerFromCleanup: PropTypes.func,
    history: PropTypes.object,
    setCleanupState: PropTypes.func
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
      isPlaying: false,
      isFirstRender: true,
      showVolumeSlider: false,
      volume: this.props.stagedSample.volume,
      showEffectsModal: false,
      loopCount: this.props.stagedSample.loopCount,
      loopPadding: this.props.stagedSample.loopPadding || null
    }
  }

  _clickUseThisSelection = () => {
    const mainEditUrl = getMainEditUrl(this.props.match.path)

    this.props.history.push(`${mainEditUrl}/staging`)
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

    this.setState({ volume })
    this.props.setStagedSample({
      volume
    })
  }

  _onLoopCountSliderFinish = (value) => {
    this.setState({ loopCount: value })
    this.props.setStagedSample({ loopCount: value })
  }

  _onLoopPaddingSliderFinish = (value) => {
    this.setState({ loopPadding: value })
    this.props.setStagedSample({ loopPadding: value })
  }

  _onLeftSliderChange = (value) => {
    this.props.setCleanupState({ leftSliderValue: value })
  }

  _onLeftSliderFinish = (value) => {
    this.props.createPlayerFromCleanup({ leftSliderValue: value })
  }

  _onRightSliderChange = (value) => {
    this.props.setCleanupState({ rightSliderValue: value })
  }

  _onRightSliderFinish = (value) => {
    this.props.createPlayerFromCleanup({ rightSliderValue: value })
  }

  _handleBackAction = () => {
    /**
     * reset the dimensions of the trak to that without staged sample
     */
    this.props.updateDimensionsWithAdditionalSample({})

    const mainEditUrl = getMainEditUrl(this.props.match.url)
    this.props.history.push(`${mainEditUrl}/recorder`)
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
          this.props.createPlayerFromCleanup({})

          this.props.addItemToNavBar({
            TOP_LEFT: { type: 'BACK', cb: this._handleBackAction },
            BOTTOM_RIGHT: { type: 'CHECK', cb: this._clickUseThisSelection },
            BOTTOM_LEFT: { type: 'VOLUME', cb: this._toggleVolumeSlider },
            BOTTOM_CENTER: { type: 'MENU', cb: this._toggleEffectsModal }
          })
        }
      })
    }
  }

  render () {
    const top = this.state.canvasHeight * this.props.cleanupState.leftSliderValue
    const bottom = this.state.canvasHeight - (this.state.canvasHeight * this.props.cleanupState.rightSliderValue)

    const sampleDuration = this.props.stagedSample.duration

    return (
      <div ref={(container) => { this.container = container }}>
        <div className={styles.label}>
          {
            <div>
              <canvas
                className={styles.canvas}
                width={this.state.canvasWidth || 0}
                height={this.state.canvasHeight || 0}
                ref={(canvas) => { this.canvas = canvas }}
              />
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
                    max={25}
                    min={-25}
                    step={1}
                    onAfterChange={this._onVolumeSliderFinish}
                    defaultValue={this.state.volume * -1}
                  />
                )
              }

              {
                this.state.showEffectsModal && sampleDuration && (
                  <div className={styles.container}>
                    <React.Fragment>
                      <div>
                      # of loops
                      </div>
                      <ReactSlider
                        orientation='horizontal'
                        className={styles.loopsSlider}
                        handleClassName={styles.loopsSliderHandle}
                        max={maxLoopCount}
                        min={0}
                        step={1}
                        onAfterChange={this._onLoopCountSliderFinish}
                        defaultValue={this.props.stagedSample.loopCount || 0}
                      />
                      <div>
                      Space between loops
                      </div>
                      <ReactSlider
                        orientation='horizontal'
                        className={styles.loopsSlider}
                        handleClassName={styles.loopsSliderHandle}
                        max={sampleDuration}
                        min={0}
                        step={sampleDuration / 500}
                        onAfterChange={this._onLoopPaddingSliderFinish}
                        defaultValue={this.props.stagedSample.loopPadding || sampleDuration}
                      />
                    </React.Fragment>
                  </div>
                )
              }
            </div>
          }
        </div>
      </div>
    )
  }
}

const mapActionsToProps = {
  updateDimensionsWithAdditionalSample,
  setStagedSample,
}

function mapStateToProps (state) {
  return {
    stagedSample: selectors.getStagedSample(state),
    objectUrl: selectors.getStagedObjectUrl(state),
    cleanup: selectors.getCleanup(state)
  }
}

export default compose(
  withStyles(styles),
  connect(mapStateToProps, mapActionsToProps)
)(Cleanup)
