import React from 'react'
import PropTypes from 'prop-types'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import ReactSlider from 'react-slider'
import classnames from 'classnames'

import styles from './effectsModal.css'

const maxLoopCount = 30

class EffectsModal extends React.Component {
  static propTypes = {
    clipDuration: PropTypes.number,
    createPlayerFromCleanup: PropTypes.func,
    loopCount: PropTypes.number,
    loopPadding: PropTypes.number
  }

  constructor (props) {
    super(props)

    this.state = {

    }
  }

  _onLoopCountSliderFinish = (value) => {
    this.props.createPlayerFromCleanup({ loopCount: value })
  }

  _onLoopPaddingSliderFinish = (value) => {
    this.props.createPlayerFromCleanup({ loopPadding: value })
  }

  render () {
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
}

export default withStyles(styles)(EffectsModal)