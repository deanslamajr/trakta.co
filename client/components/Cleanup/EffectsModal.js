import React from 'react'
import PropTypes from 'prop-types'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import ReactSlider from 'react-slider'
import classnames from 'classnames'
import Tone from 'tone'

import { PITCH } from '../../lib/effects'

import styles from './effectsModal.css'

const maxLoopCount = 30

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
      renderContent: this._renderPitchShift
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

  _handlePitchShiftSlider = (value) => {
    const shiftInterval = value * -1

    const pitchShiftConfig = {
      type: PITCH,
      shiftInterval
    }

    this.props.createPlayerFromCleanupWithEffect(pitchShiftConfig)
  }

  _renderPitchShift = () => {
    const pitchShiftConfig = this.props.effects.find(({ type }) => type === PITCH)

    return (
      <div className={styles.container}>
        <React.Fragment>
          <div>
          Pitch Shift
          </div>
          <ReactSlider
            orientation='vertical'
            className={styles.verticalSlider}
            handleClassName={styles.loopsSliderHandle}
            max={12}
            min={-12}
            step={1}
            onAfterChange={this._handlePitchShiftSlider}
            defaultValue={pitchShiftConfig ? -1 * pitchShiftConfig.shiftInterval : 0}
          />
        </React.Fragment>
      </div>
    )
  }

  render () {
    return this.state.renderContent()
  }
}

export default withStyles(styles)(EffectsModal)