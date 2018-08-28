import React from 'react'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import classnames from 'classnames'
import viewportDimensions from 'viewport-dimensions'

import getColorFromString from '../../../lib/getColorFromString'

import styles from './listItem.css'

function getWidth (plays) {
  return plays >= 50
    ? '100%'
    : `${(plays / 50) * 100}%`
}

class ListItem extends React.Component {
  renderPlaybackIndicator = () => {
    return (
      <svg
        className={styles.playbackIndicator}
        width='100%'
        height='100%'
      >
        <line
          y1='0'
          y2='100%'
          ref={ref => { this.playIndicatorEl = ref }}
        />
      </svg>
    )
  }

  _stopAnimation = (aniData) => {
    clearInterval(aniData.id)
    if (this.playIndicatorEl) {
      this.playIndicatorEl.setAttribute('stroke', 'transparent')
    }
    aniData.position = 0
  }

  _playAnimation = (playbackDurationSeconds, aniData, time) => {
    if (this.playIndicatorEl) {
      const animationInterval = 40
      const playbackDurationMilliseconds = playbackDurationSeconds * 1000
      const numberOfFrames = (playbackDurationMilliseconds / animationInterval)

      const width = viewportDimensions
        ? viewportDimensions.width() && viewportDimensions.width()
        : 300

      const displacementPerFrame = width / numberOfFrames
      aniData.position = 0

      const drawPos = function drawPosition (playIndicatorEl) {
        aniData.position = aniData.position <= width
          ? aniData.position + displacementPerFrame
          : width

        if (playIndicatorEl) {
          playIndicatorEl.setAttribute('x1', aniData.position)
          playIndicatorEl.setAttribute('x2', aniData.position)
        }
      }

      if (this.playIndicatorEl) {
        this.playIndicatorEl.setAttribute('stroke', 'black')
      }

      if (aniData.id) {
        clearInterval(aniData.id)
      }
      // draw first frame of animation
      drawPos(this.playIndicatorEl)
      // setup interval for the other frames
      aniData.id = setInterval(() => drawPos(this.playIndicatorEl), animationInterval)
    }
  }

  _handleClick = () => {
    const { trak, handleClick } = this.props

    handleClick(trak, this._playAnimation, this._stopAnimation)
  }

  render () {
    const { trak, selectedTrakId, hasViewed } = this.props

    const width = getWidth(trak.plays_count)
    const colorClass = getColorFromString(trak.name)
    const dataVizStyle = {
      width
    }

    const isSelected = trak.id === selectedTrakId

    const hasViewedAndDeselected = hasViewed && !isSelected

    const clickHandler = isSelected
      ? () => {} // shouldn't be able to select a selected item
      : () => this._handleClick()

    return (
      <div
        className={classnames(styles.card, styles[`${colorClass}Base`], { [styles.selected]: isSelected })}
        onClick={clickHandler}
      >
        <div className={classnames({ [styles.visible]: hasViewedAndDeselected }, styles.listenedCard)}>
          <div className={styles.listenedName}>
            { trak.name }
          </div>
        </div>
        <div style={dataVizStyle} className={classnames(styles.cardContainer, styles[colorClass], { [styles.selected]: isSelected })} />
        <div className={classnames(styles.name, { [styles.invisible]: hasViewedAndDeselected })}>
          { trak.name }
        </div>
        {isSelected && this.renderPlaybackIndicator()}
      </div>
    )
  }
}

export default withStyles(styles)(ListItem)
