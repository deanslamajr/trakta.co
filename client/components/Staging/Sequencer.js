import React from 'react'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import classnames from 'classnames'

import styles from './Sequencer.css'

const lengthOfTrak = 5 // seconds
const beatsPerBar = 4
const sixteenthsPerBar = beatsPerBar * 4
const numberOfBars = 4

const numberOfColumns = 4

/**
 * @todo
 * 
 * Use `lengthOfTrak` to determine number of ...
 * 
 * 
 * 
 * 
 */



class Sequencer extends React.Component {
  render () {
    const { onItemSelect, selectedItems } = this.props

    return (
      <div className={styles.container}>
        <span className={styles.column}>
          <div className={classnames(styles.item, {[styles.selected]: selectedItems[1]})} onClick={() => onItemSelect(1)} />
          <div className={classnames(styles.item, {[styles.selected]: selectedItems[5]})} onClick={() => onItemSelect(5)} />
          <div className={classnames(styles.item, {[styles.selected]: selectedItems[9]})} onClick={() => onItemSelect(9)} />
          <div className={classnames(styles.item, {[styles.selected]: selectedItems[13]})} onClick={() => onItemSelect(13)} />
          <div className={classnames(styles.item, {[styles.selected]: selectedItems[17]})} onClick={() => onItemSelect(17)} />
          <div className={classnames(styles.item, {[styles.selected]: selectedItems[21]})} onClick={() => onItemSelect(21)} />
          <div className={classnames(styles.item, {[styles.selected]: selectedItems[25]})} onClick={() => onItemSelect(25)} />
          <div className={classnames(styles.item, {[styles.selected]: selectedItems[29]})} onClick={() => onItemSelect(29)} />
        </span>

        <span className={classnames(styles.column, styles.secondColumn)}>
          <div className={classnames(styles.item, {[styles.selected]: selectedItems[2]})} onClick={() => onItemSelect(2)} />
          <div className={classnames(styles.item, {[styles.selected]: selectedItems[6]})} onClick={() => onItemSelect(6)} />
          <div className={classnames(styles.item, {[styles.selected]: selectedItems[10]})} onClick={() => onItemSelect(10)} />
          <div className={classnames(styles.item, {[styles.selected]: selectedItems[14]})} onClick={() => onItemSelect(14)} />
          <div className={classnames(styles.item, {[styles.selected]: selectedItems[18]})} onClick={() => onItemSelect(18)} />
          <div className={classnames(styles.item, {[styles.selected]: selectedItems[22]})} onClick={() => onItemSelect(22)} />
          <div className={classnames(styles.item, {[styles.selected]: selectedItems[26]})} onClick={() => onItemSelect(26)} />
          <div className={classnames(styles.item, {[styles.selected]: selectedItems[30]})} onClick={() => onItemSelect(30)} />
        </span>

        <span className={classnames(styles.column, styles.thirdColumn)}>
          <div className={classnames(styles.item, {[styles.selected]: selectedItems[3]})} onClick={() => onItemSelect(3)} />
          <div className={classnames(styles.item, {[styles.selected]: selectedItems[7]})} onClick={() => onItemSelect(7)} />
          <div className={classnames(styles.item, {[styles.selected]: selectedItems[11]})} onClick={() => onItemSelect(11)} />
          <div className={classnames(styles.item, {[styles.selected]: selectedItems[15]})} onClick={() => onItemSelect(15)} />
          <div className={classnames(styles.item, {[styles.selected]: selectedItems[19]})} onClick={() => onItemSelect(19)} />
          <div className={classnames(styles.item, {[styles.selected]: selectedItems[23]})} onClick={() => onItemSelect(23)} />
          <div className={classnames(styles.item, {[styles.selected]: selectedItems[27]})} onClick={() => onItemSelect(27)} />
          <div className={classnames(styles.item, {[styles.selected]: selectedItems[31]})} onClick={() => onItemSelect(31)} />
        </span>

        <span className={classnames(styles.column, styles.fourthColumn)}>
          <div className={classnames(styles.item, {[styles.selected]: selectedItems[4]})} onClick={() => onItemSelect(4)} />
          <div className={classnames(styles.item, {[styles.selected]: selectedItems[8]})} onClick={() => onItemSelect(8)} />
          <div className={classnames(styles.item, {[styles.selected]: selectedItems[12]})} onClick={() => onItemSelect(12)} />
          <div className={classnames(styles.item, {[styles.selected]: selectedItems[16]})} onClick={() => onItemSelect(16)} />
          <div className={classnames(styles.item, {[styles.selected]: selectedItems[20]})} onClick={() => onItemSelect(20)} />
          <div className={classnames(styles.item, {[styles.selected]: selectedItems[24]})} onClick={() => onItemSelect(24)} />
          <div className={classnames(styles.item, {[styles.selected]: selectedItems[28]})} onClick={() => onItemSelect(28)} />
          <div className={classnames(styles.item, {[styles.selected]: selectedItems[32]})} onClick={() => onItemSelect(32)} />
        </span>
      </div>
    )
  }
}

export default withStyles(styles)(Sequencer)