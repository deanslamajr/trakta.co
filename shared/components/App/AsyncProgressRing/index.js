import React from 'react'
import withStyles from 'isomorphic-style-loader/lib/withStyles'

import styles from './styles.css'

class ProgressRing extends React.Component {
  constructor (props) {
    super(props)

    const { radius, stroke } = this.props

    this.circumference = radius * 2 * Math.PI
    this.normalizedRadius = radius - stroke * 2
  }

  render () {
    const { radius, stroke, progress } = this.props
    const strokeDashoffset = this.circumference - progress * this.circumference || 0

    return (
      <div className={styles.container}>
        <svg
          height={radius * 2}
          width={radius * 2}
          >
          <circle
            stroke='black'
            fill='transparent'
            strokeWidth={stroke}
            strokeDasharray={this.circumference + ' ' + this.circumference}
            style={{ strokeDashoffset }}
            r={this.normalizedRadius}
            cx={radius}
            cy={radius}
            />
        </svg>
      </div>
    )
  }
}

export default withStyles(styles)(ProgressRing)
