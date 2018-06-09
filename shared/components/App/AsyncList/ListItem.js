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

function ListItem ({ trak, handleClick, selectedTrakId }) {
  const width = getWidth(trak.plays_count)
  const colorClass = getColorClass(trak.name)
  const opacity = getOpacity(trak.duration)
  const style = {
    opacity,
    width
  }

  const isSelected = trak.id === selectedTrakId

  return (
    <div
      className={classnames(styles.card, styles[`${colorClass}Base`], { [styles.selected]: isSelected })}
      onClick={() => handleClick(trak.id)}
    >
      <div style={style} className={classnames(styles.cardContainer, styles[colorClass])} />
      <div className={styles.name}>
        { trak.name }
      </div>
    </div>
  )
}

export default withStyles(styles)(ListItem)
