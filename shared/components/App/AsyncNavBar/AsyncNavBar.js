import React from 'react'
import classnames from 'classnames'
import withStyles from 'isomorphic-style-loader/lib/withStyles'

import MdArrowBack from 'react-icons/lib/md/arrow-back'
import MdMic from 'react-icons/lib/md/mic'
import MdCheck from 'react-icons/lib/md/check'
import MdPlayArrow from 'react-icons/lib/md/play-arrow'
import MdStop from 'react-icons/lib/md/stop'
import MdAdd from 'react-icons/lib/md/add'
import MdRefresh from 'react-icons/lib/md/refresh'
import MdEdit from 'react-icons/lib/md/edit'

import styles from './styles.css'

function renderBackButton () {
  return (<MdArrowBack className={styles.button} color={styles.white} />)
}

function renderRecordButton () {
  return (<MdMic className={styles.button} color={styles.white} />)
}

function renderCheckButton () {
  return (<MdCheck className={styles.button} color={styles.white} />)
}

function renderPlayButton () {
  return (<MdPlayArrow className={styles.button} size={25} color={styles.white} />)
}

function renderStopButton () {
  return (<MdStop className={styles.button} color={styles.white} />)
}

function renderAddButton () {
  return (<MdAdd className={styles.button} color={styles.white} />)
}

function renderRefreshButton () {
  return (<MdRefresh className={styles.button} color={styles.white} />)
}

function renderLoadingButton () {
  return (<div className={classnames(styles.loadSpinner, styles.button)} />)
}

function renderEditButton () {
  return (<MdEdit className={styles.button} color={styles.white} />)
}

/**
 * render a button
 * @param {oneOf[buttonMappings]} type the content definition enum
 * @param {oneOf['left', 'center', 'right']} position where to position the button on the navbar
 * @param {function} cb function to invoke on a click action
 */
function renderButton (type, position, cb) {
  const buttonMapping = buttonMappings[type]
  const positionClass = positionMappings[position]

  return (
    <div key={position} className={classnames(styles.buttonContainer, styles[positionClass], buttonMapping.styles)} onClick={cb}>
      <buttonMapping.Icon />
    </div>
  )
}

const buttonMappings = {
  ADD: {
    Icon: renderAddButton,
    styles: styles.greenButton
  },
  BACK: {
    Icon: renderBackButton,
    styles: styles.redButton
  },
  CHECK: {
    Icon: renderCheckButton,
    styles: styles.greenButton
  },
  PLAY: {
    Icon: renderPlayButton,
    styles: styles.redButton
  },
  RECORD: {
    Icon: renderRecordButton,
    styles: styles.greenButton
  },
  REFRESH: {
    Icon: renderRefreshButton,
    styles: styles.blueButton
  },
  STOP: {
    Icon: renderStopButton,
    styles: styles.redButton
  },
  LOADING: {
    Icon: renderLoadingButton,
    styles: styles.redButton
  },
  EDIT: {
    Icon: renderEditButton,
    styles: styles.greenButton
  }
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
