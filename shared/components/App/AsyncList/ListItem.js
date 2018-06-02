import React from 'react'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import classnames from 'classnames'

import styles from './listItem.css'

function getWidth (seconds) {
  return seconds > 5
    ? '100%'
    : `${(seconds / 5) * 100}%`
}

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

function getOpacity (plays) {
  return plays >= 50
    ? 1
    : plays / 50
}

function ListItem ({ trak, handleClick }) {
  const width = getWidth(trak.duration)
  const colorClass = getColorClass(trak.name)
  const opacity = getOpacity(trak.plays_count)
  const style = {
    opacity,
    width
  }

  return (
    <div
      className={classnames(styles.card, styles[`${colorClass}Base`])}
      onClick={() => handleClick(trak.name)}
    >
      <div style={style} className={classnames(styles.cardContainer, styles[colorClass])} />
      <div className={styles.name}>
        { trak.name }
      </div>
    </div>
  )
}

export default withStyles(styles)(ListItem)
