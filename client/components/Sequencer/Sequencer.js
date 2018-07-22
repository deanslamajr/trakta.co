import React from 'react'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import classnames from 'classnames'
import Tone from 'tone'

import styles from './Sequencer.css'

// const beatsPerBar = 4
// const sixteenthsPerBar = beatsPerBar * 4
// const numberOfBars = 4

const numberOfColumns = 4
const durationOfTrakInSeconds = 6
const durationOfSixteenthInSeconds = (new Tone.Time('0:0:1')).toSeconds()
const totalNumberOfSixteenths = Math.ceil(durationOfTrakInSeconds / durationOfSixteenthInSeconds)

class Sequencer extends React.Component {
  render () {
    const { onItemSelect, selectedItems } = this.props

    const columns = []
    for (let i = 0; i < numberOfColumns; i++) {
      columns.push([])
    }

    let i = 0
    while (i < totalNumberOfSixteenths) {
      columns.forEach(column => {
        if (i < totalNumberOfSixteenths) {
          column.push(i)
          i++
        }
      })
    }

    return (
      <div className={styles.container}>
        {
          columns.map((column, index) => {
            return (
              <span
                key={index}
                className={styles.column}
                style={{ marginTop: `${index}rem` }}
              >
                {
                column.map(itemNumber => (
                  <div
                    key={itemNumber}
                    className={classnames(styles.item, {[styles.selected]: selectedItems[itemNumber]})}
                    onClick={() => onItemSelect(itemNumber)}
                  />
                ))
              }
              </span>
            )
          })
        }
      </div>
    )
  }
}

export default withStyles(styles)(Sequencer)
