import React from 'react'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import classnames from 'classnames'

import getColorFromString from './getColorFromString'

import styles from './listItem.css'

function getWidth (plays) {
  return plays >= 50
    ? '100%'
    : `${(plays / 50) * 100}%`
}

function ListItem ({ trak, handleClick, selectedTrakId, hasViewed }) {
  const width = getWidth(trak.plays_count)
  const colorClass = getColorFromString(trak.name)
  const dataVizStyle = {
    width
  }

  const isSelected = trak.id === selectedTrakId

  const hasViewedAndDeselected = hasViewed && !isSelected

  const clickHandler = isSelected
    ? () => {} // shouldn't be able to select a selected item
    : () => handleClick(trak)

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
    </div>
  )
}

export default withStyles(styles)(ListItem)
