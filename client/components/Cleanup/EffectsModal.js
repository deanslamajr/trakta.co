import React from 'react'
import PropTypes from 'prop-types'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import ReactSlider from 'react-slider'
import classnames from 'classnames'
import Tone from 'tone'

import {
  CHORUS,
  PITCHSHIFT,
  REVERB
} from '../../lib/effects'

import styles from './effectsModal.css'

const maxLoopCount = 30
const initialShiftInterval = 5
const initialChorusDepth = 0.5
const initialRoomSize = 0.7

function convertNormalScaledSlider (value) {
  return (value - 1) * -1
}

function convertPitchShiftSlider (value) {
  return value * -1
}

class EffectsModal extends React.Component {
  static propTypes = {
    clipDuration: PropTypes.number,
    createPlayerFromCleanup: PropTypes.func,
    createPlayerFromCleanupWithEffect: PropTypes.func,
    effects: PropTypes.array,
    loopCount: PropTypes.number,
    loopPadding: PropTypes.number
  }

  constructor (props) {
    super(props)

    this.state = {
      activeEffect: null
    }

    this.effects = {
      [PITCHSHIFT]: this._renderPitchShift,
      [CHORUS]: this._renderChorus,
      [REVERB]: this._renderReverb
    }
  }

  _onLoopCountSliderFinish = (value) => {
    this.props.createPlayerFromCleanup({ loopCount: value })
  }

  _onLoopPaddingSliderFinish = (value) => {
    this.props.createPlayerFromCleanup({ loopPadding: value })
  }

  _renderLoopsModal = () => {
    return (
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
            defaultValue={this.props.loopCount}
          />
          <div>
          Space between loops
          </div>
          <ReactSlider
            orientation='horizontal'
            className={styles.loopsSlider}
            handleClassName={styles.loopsSliderHandle}
            max={this.props.clipDuration}
            min={0}
            step={this.props.clipDuration / 500}
            onAfterChange={this._onLoopPaddingSliderFinish}
            defaultValue={this.props.loopPadding}
          />
        </React.Fragment>
      </div>
    )
  }

  /**
   * PitchShift
   */

  _handlePitchShiftSlider = (value) => {
    const shiftInterval = convertPitchShiftSlider(value)

    const pitchShiftConfig = {
      type: PITCHSHIFT,
      shiftInterval
    }

    this.props.createPlayerFromCleanupWithEffect(pitchShiftConfig)
  }

  _createPlayerWithPitchShift = (shiftInterval) => {
    const pitchShiftConfig = {
      type: PITCHSHIFT,
      shiftInterval
    }

    this.props.createPlayerFromCleanupWithEffect(pitchShiftConfig)
  }

  _renderPitchShift = () => {
    const pitchShiftConfig = this.props.effects.find(({ type }) => type === PITCHSHIFT)

    return (
      <React.Fragment>
        <div>
        {PITCHSHIFT}
        </div>
        <ReactSlider
          orientation='vertical'
          className={styles.verticalSlider}
          handleClassName={styles.loopsSliderHandle}
          max={12}
          min={-12}
          step={1}
          onAfterChange={this._handlePitchShiftSlider}
          defaultValue={pitchShiftConfig ? convertPitchShiftSlider(pitchShiftConfig.shiftInterval) : initialShiftInterval}
        />
      </React.Fragment>
    )
  }

  _handlePitchShiftSelect = () => {
    const pitchShiftConfig = this.props.effects.find(({ type }) => type === PITCHSHIFT)

    const shiftInterval = pitchShiftConfig
      ? pitchShiftConfig.shiftInterval
      : initialShiftInterval

    this._createPlayerWithPitchShift(shiftInterval)

    this.setState({ activeEffect: PITCHSHIFT })
  }

  /**
   * Chorus
   */

  _handleChorusShiftSlider = (value) => {
    const chorusDepth = convertNormalScaledSlider(value)
    this._createPlayerWithChorus(chorusDepth)
  }

  _createPlayerWithChorus = (chorusDepth) => {
    const chorusConfig = {
      type: CHORUS,
      chorusDepth
    }

    this.props.createPlayerFromCleanupWithEffect(chorusConfig)
  }

  _renderChorus = () => {
    const chorusConfig = this.props.effects.find(({ type }) => type === CHORUS)

    return (
      <React.Fragment>
        <div>
        {CHORUS}
        </div>
        <ReactSlider
          orientation='vertical'
          className={styles.verticalSlider}
          handleClassName={styles.loopsSliderHandle}
          max={1}
          min={0}
          step={.01}
          onAfterChange={this._handleChorusShiftSlider}
          defaultValue={chorusConfig ? convertNormalScaledSlider(chorusConfig.chorusDepth) : initialChorusDepth}
        />
      </React.Fragment>
    )
  }

  _handleChorusSelect = () => {
    const chorusConfig = this.props.effects.find(({ type }) => type === CHORUS)

    const chorusDepth = chorusConfig
      ? chorusConfig.chorusDepth
      : initialChorusDepth

    this._createPlayerWithChorus(chorusDepth)

    this.setState({ activeEffect: CHORUS })
  }

  /**
   * Reverb
   */

  _handleReverbSlider = (value) => {
    const roomSize = convertNormalScaledSlider(value)
    this._createPlayerWithReverb(roomSize)
  }

  _createPlayerWithReverb = (roomSize) => {
    const reverbConfig = {
      type: REVERB,
      roomSize
    }

    this.props.createPlayerFromCleanupWithEffect(reverbConfig)
  }

  _renderReverb = () => {
    const reverbConfig = this.props.effects.find(({ type }) => type === REVERB)

    return (
      <React.Fragment>
        <div>
        {REVERB}
        </div>
        <ReactSlider
          orientation='vertical'
          className={styles.verticalSlider}
          handleClassName={styles.loopsSliderHandle}
          max={1}
          min={0}
          step={.01}
          onAfterChange={this._handleReverbSlider}
          defaultValue={reverbConfig ? convertNormalScaledSlider(reverbConfig.roomSize) : initialRoomSize}
        />
      </React.Fragment>
    )
  }

  _handleReverbSelect = () => {
    const reverbConfig = this.props.effects.find(({ type }) => type === REVERB)

    const roomSize = reverbConfig
      ? reverbConfig.roomSize
      : initialRoomSize

    this._createPlayerWithReverb(roomSize)

    this.setState({ activeEffect: REVERB })
  }

  /**
   * Menu
   */

  _renderMenu = () => {
    return (
      <div className={styles.menu}>
        <div onClick={this._handlePitchShiftSelect} className={classnames(styles.effectsItem, styles.pitchshift)}>{PITCHSHIFT}</div>
        <div onClick={this._handleChorusSelect} className={classnames(styles.effectsItem, styles.chorus)}>{CHORUS}</div>
        <div onClick={this._handleReverbSelect} className={classnames(styles.effectsItem, styles.reverb)}>{REVERB}</div>
      </div>
    )
  }

  render () {
    return (
      <div className={styles.container}>
        {
          this.state.activeEffect
            ? this.effects[this.state.activeEffect]()
            : this._renderMenu()
        }
      </div>
    )
  }
}

export default withStyles(styles)(EffectsModal)