import React from 'react'
import classnames from 'classnames'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import {
  MdArrowBack,
  MdMic,
  MdCheck,
  MdPlayArrow,
  MdStop,
  MdAdd
} from 'react-icons/lib/md'

import styles from './styles.css'

const red = 'rgb(246, 81, 29)'
const green = 'rgb(151, 204, 4)'
const blue = 'rgb(0, 138, 206)'

function renderBackButton () {
  return (<MdArrowBack className={styles.backIcon} size={50} color={red} />)
}

function renderRecordButton () {
  return (<MdMic className={styles.icon} size={50} color={green} />)
}

function renderCheckButton () {
  return (<MdCheck className={styles.icon} size={50} color={green} />)
}

function renderPlayButton () {
  return (<MdPlayArrow className={styles.playIcon} size={60} color={blue} />)
}

function renderStopButton () {
  return (<MdStop className={styles.stopIcon} size={60} color={red} />)
}

function renderAddButton () {
  return (<MdAdd className={styles.addIcon} size={50} color={green} />)
}

/**
 * render a button
 * @param {oneOf[buttonMappings]} type the content definition enum
 * @param {oneOf['left', 'center', 'right']} position where to position the button on the navbar
 * @param {function} cb function to invoke on a click action
 */
function renderButton (type, position, cb) {
  const Icon = buttonMappings[type]
  const positionClass = positionMappings[position]

  return (
    <div key={position} className={classnames(styles.button, styles[positionClass])} onClick={cb}>
      <Icon />
    </div>
  )
}

const buttonMappings = {
  ADD: renderAddButton,
  BACK: renderBackButton,
  CHECK: renderCheckButton,
  PLAY: renderPlayButton,
  RECORD: renderRecordButton,
  STOP: renderStopButton
}

const positionMappings = {
  TOP_LEFT: 'top-left',
  TOP_CENTER: 'top-center',
  TOP_RIGHT: 'top-right',
  BOTTOM_LEFT: 'bottom-left',
  BOTTOM_CENTER: 'bottom-center',
  BOTTOM_RIGHT: 'bottom-right'
}

class NavBar extends React.Component {
  constructor () {
    super()

    this.state = {
      positions: {}
    }

    this.addItemToNavBar = this.addItemToNavBar.bind(this)
  }

  addItemToNavBar (updatedPositionConfigs, retainAllOtherItems) {
    if (updatedPositionConfigs === null) {
      this.setState({ positions: {} })
    } else {
      const validPositionsToChange = Object.keys(updatedPositionConfigs).filter(position => positionMappings[position])

      const basePositions = retainAllOtherItems
        ? Object.assign({}, this.state.positions)
        : {}

      validPositionsToChange.forEach(position => {
        if (updatedPositionConfigs[position] === null) {
          delete basePositions[position]
        } else {
          basePositions[position] = updatedPositionConfigs[position]
        }
      })

      this.setState({ positions: basePositions })
    }
  }

  render () {
    const { positions } = this.state
    const occupiedPositions = Object.keys(positions)

    return (
      <div>
        {
          this.props.render(this.addItemToNavBar)
        }

        <div className={styles.container} >
          {
            occupiedPositions.map(position => {
              if (position === null) {
                return
              }

              const config = positions[position]
              return renderButton(config.type, position, config.cb)
            })
          }
        </div>
      </div>
    )
  }
}

export { NavBar }

export default withStyles(styles)(NavBar)
