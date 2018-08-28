import React from 'react'
import PropTypes from 'prop-types'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import ReactSlider from 'react-slider'
import classnames from 'classnames'
import Tone from 'tone'

import { VerticalSliderIcon } from './index'

import {
  CHORUS,
  PITCHSHIFT,
  REVERB,
  DISTORTION
} from '../../lib/effects'

import styles from './effectsModal.css'

const initialShiftInterval = 5
const initialChorusDepth = 0.5
const initialRoomSize = 0.7
const initialDistortion = 0.5

function convertNormalScaledSlider (value) {
  return (value - 1) * -1
}

function convertPitchShiftSlider (value) {
  return value * -1
}

class EffectsModal extends React.Component {
  static propTypes = {
    createPlayerFromCleanup: PropTypes.func,
    createPlayerFromCleanupWithEffect: PropTypes.func,
    effects: PropTypes.array
  }

  constructor (props) {
    super(props)

    this.state = {
      activeEffect: null
    }

    this.effects = {
      [PITCHSHIFT]: this._renderPitchShift,
      [CHORUS]: this._renderChorus,
      [REVERB]: this._renderReverb,
      [DISTORTION]: this._renderDistortion
    }
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
      <ReactSlider
        orientation='vertical'
        className={styles.verticalSlider}
        handleClassName={styles.loopsSliderHandle}
        max={12}
        min={-12}
        step={1}
        onAfterChange={this._handlePitchShiftSlider}
        defaultValue={pitchShiftConfig ? convertPitchShiftSlider(pitchShiftConfig.shiftInterval) : initialShiftInterval}
      >
        <VerticalSliderIcon />
      </ReactSlider>
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
      <ReactSlider
        orientation='vertical'
        className={styles.verticalSlider}
        handleClassName={styles.loopsSliderHandle}
        max={1}
        min={0}
        step={.01}
        onAfterChange={this._handleChorusShiftSlider}
        defaultValue={chorusConfig ? convertNormalScaledSlider(chorusConfig.chorusDepth) : initialChorusDepth}
      >
        <VerticalSliderIcon />
      </ReactSlider>
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
      <ReactSlider
        orientation='vertical'
        className={styles.verticalSlider}
        handleClassName={styles.loopsSliderHandle}
        max={1}
        min={0}
        step={.01}
        onAfterChange={this._handleReverbSlider}
        defaultValue={reverbConfig ? convertNormalScaledSlider(reverbConfig.roomSize) : initialRoomSize}
      >
        <VerticalSliderIcon />
      </ReactSlider>
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
   * Distortion
   */

  _handleDistortionSlider = (value) => {
    const distortion = convertNormalScaledSlider(value)
    this._createPlayerWithDistortion(distortion)
  }

  _createPlayerWithDistortion = (distortion) => {
    const distortionConfig = {
      type: DISTORTION,
      distortion
    }

    this.props.createPlayerFromCleanupWithEffect(distortionConfig)
  }

  _renderDistortion = () => {
    const distortionConfig = this.props.effects.find(({ type }) => type === DISTORTION)

    return (
      <ReactSlider
        orientation='vertical'
        className={styles.verticalSlider}
        handleClassName={styles.loopsSliderHandle}
        max={1}
        min={0}
        step={.01}
        onAfterChange={this._handleDistortionSlider}
        defaultValue={distortionConfig ? convertNormalScaledSlider(distortionConfig.distortion) : initialDistortion}
      >
        <VerticalSliderIcon />
      </ReactSlider>
    )
  }

  _handleDistortionSelect = () => {
    const distortionConfig = this.props.effects.find(({ type }) => type === DISTORTION)

    const distortion = distortionConfig
      ? distortionConfig.distortion
      : initialRoomSize

    this._createPlayerWithDistortion(distortion)

    this.setState({ activeEffect: DISTORTION })
  }

  /**
   * No effects
   */

  _handleNoneSelect = () => {
    const activeEffect = this.props.effects.find(({ isActive }) => isActive)

    this.props.createPlayerFromCleanupWithEffect(activeEffect, false)
  }

  /**
   * Menu
   */

  _renderMenu = () => {
    const activeEffect = this.props.effects.find(({ isActive }) => isActive)
    
    const activeEffectType = activeEffect
      ? activeEffect.type
      : 'none'

    return (
      <div className={styles.menu}>
        <div onClick={this._handleNoneSelect} className={classnames(styles.effectsItem, styles.none, { [styles.selected]: activeEffectType === 'none' })}>(no effects)</div>
        <div onClick={this._handlePitchShiftSelect} className={classnames(styles.effectsItem, styles.pitchshift, { [styles.selected]: activeEffectType === PITCHSHIFT })}>{PITCHSHIFT}</div>
        <div onClick={this._handleChorusSelect} className={classnames(styles.effectsItem, styles.chorus, { [styles.selected]: activeEffectType === CHORUS })}>{CHORUS}</div>
        <div onClick={this._handleReverbSelect} className={classnames(styles.effectsItem, styles.reverb, { [styles.selected]: activeEffectType === REVERB })}>{REVERB}</div>
        <div onClick={this._handleDistortionSelect} className={classnames(styles.effectsItem, styles.distortion, { [styles.selected]: activeEffectType === DISTORTION })}>{DISTORTION}</div>
      </div>
    )
  }

  render () {
    return (
      <div className={classnames(styles.container, styles[`${this.state.activeEffect}Container`])}>
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