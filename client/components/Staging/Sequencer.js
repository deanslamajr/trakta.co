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

          <div className={classnames(styles.item, {[styles.selected]: selectedItems[33]})} onClick={() => onItemSelect(33)} />
          <div className={classnames(styles.item, {[styles.selected]: selectedItems[37]})} onClick={() => onItemSelect(37)} />

          <div className={classnames(styles.item, {[styles.selected]: selectedItems[41]})} onClick={() => onItemSelect(41)} />
          <div className={classnames(styles.item, {[styles.selected]: selectedItems[45]})} onClick={() => onItemSelect(45)} />
          <div className={classnames(styles.item, {[styles.selected]: selectedItems[49]})} onClick={() => onItemSelect(49)} />
          <div className={classnames(styles.item, {[styles.selected]: selectedItems[53]})} onClick={() => onItemSelect(53)} />
          <div className={classnames(styles.item, {[styles.selected]: selectedItems[57]})} onClick={() => onItemSelect(57)} />
          <div className={classnames(styles.item, {[styles.selected]: selectedItems[61]})} onClick={() => onItemSelect(61)} />
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

          <div className={classnames(styles.item, {[styles.selected]: selectedItems[34]})} onClick={() => onItemSelect(34)} />
          <div className={classnames(styles.item, {[styles.selected]: selectedItems[38]})} onClick={() => onItemSelect(38)} />

          <div className={classnames(styles.item, {[styles.selected]: selectedItems[42]})} onClick={() => onItemSelect(42)} />
          <div className={classnames(styles.item, {[styles.selected]: selectedItems[46]})} onClick={() => onItemSelect(46)} />
          <div className={classnames(styles.item, {[styles.selected]: selectedItems[50]})} onClick={() => onItemSelect(50)} />
          <div className={classnames(styles.item, {[styles.selected]: selectedItems[54]})} onClick={() => onItemSelect(54)} />
          <div className={classnames(styles.item, {[styles.selected]: selectedItems[58]})} onClick={() => onItemSelect(58)} />
          <div className={classnames(styles.item, {[styles.selected]: selectedItems[62]})} onClick={() => onItemSelect(62)} />
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

          <div className={classnames(styles.item, {[styles.selected]: selectedItems[35]})} onClick={() => onItemSelect(35)} />
          <div className={classnames(styles.item, {[styles.selected]: selectedItems[39]})} onClick={() => onItemSelect(39)} />

          <div className={classnames(styles.item, {[styles.selected]: selectedItems[43]})} onClick={() => onItemSelect(43)} />
          <div className={classnames(styles.item, {[styles.selected]: selectedItems[47]})} onClick={() => onItemSelect(47)} />
          <div className={classnames(styles.item, {[styles.selected]: selectedItems[51]})} onClick={() => onItemSelect(51)} />
          <div className={classnames(styles.item, {[styles.selected]: selectedItems[55]})} onClick={() => onItemSelect(55)} />
          <div className={classnames(styles.item, {[styles.selected]: selectedItems[59]})} onClick={() => onItemSelect(59)} />
          <div className={classnames(styles.item, {[styles.selected]: selectedItems[63]})} onClick={() => onItemSelect(63)} />
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

          <div className={classnames(styles.item, {[styles.selected]: selectedItems[36]})} onClick={() => onItemSelect(36)} />
          <div className={classnames(styles.item, {[styles.selected]: selectedItems[40]})} onClick={() => onItemSelect(40)} />

          <div className={classnames(styles.item, {[styles.selected]: selectedItems[44]})} onClick={() => onItemSelect(44)} />
          <div className={classnames(styles.item, {[styles.selected]: selectedItems[48]})} onClick={() => onItemSelect(48)} />
          <div className={classnames(styles.item, {[styles.selected]: selectedItems[52]})} onClick={() => onItemSelect(52)} />
          <div className={classnames(styles.item, {[styles.selected]: selectedItems[56]})} onClick={() => onItemSelect(56)} />
          <div className={classnames(styles.item, {[styles.selected]: selectedItems[60]})} onClick={() => onItemSelect(60)} />
          <div className={classnames(styles.item, {[styles.selected]: selectedItems[64]})} onClick={() => onItemSelect(64)} />
        </span>
      </div>
    )
  }
}

export default withStyles(styles)(Sequencer)