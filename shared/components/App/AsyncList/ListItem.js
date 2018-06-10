import React from 'react'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import classnames from 'classnames'

import styles from './listItem.css'

const colorClasses = [
  'red',
  'blue',
  'green',
  'yellow',
  'purple',
  'pink',
  'orange',
  'teal'
]

function getColorClass (text) {
  const chars = text.split('')
  const charCodesSum = chars.reduce((sum, char) => char.charCodeAt() + sum, 0)
  const restrictedValue = charCodesSum % colorClasses.length
  return colorClasses[restrictedValue]
}

function getOpacity (seconds) {
  return seconds > 5
    ? 1
    : seconds / 5
}

function getWidth (plays) {
  return plays >= 50
    ? '100%'
    : `${(plays / 50) * 100}%`
}

function ListItem ({ trak, handleClick, selectedTrakId, hasViewed }) {
  const width = getWidth(trak.plays_count)
  const colorClass = getColorClass(trak.name)
  const opacity = getOpacity(trak.duration)
  const dataVizStyle = {
    opacity,
    width
  }

  const isSelected = trak.id === selectedTrakId
  const hasViewedAndDeselected = hasViewed && !isSelected

  return (
    <div
      className={classnames(styles.card, styles[`${colorClass}Base`], { [styles.selected]: isSelected })}
      onClick={() => handleClick(trak)}
    >
      <div className={classnames({ [styles.visible]: hasViewedAndDeselected }, styles.listenedCard)}>
        <div className={styles.listenedName}>
          { trak.name }
        </div>
      </div>
      <div style={dataVizStyle} className={classnames(styles.cardContainer, styles[colorClass])} />
      <div className={classnames(styles.name, { [styles.invisible]: hasViewedAndDeselected })}>
        { trak.name }
      </div>
    </div>
  )
}

export default withStyles(styles)(ListItem)
