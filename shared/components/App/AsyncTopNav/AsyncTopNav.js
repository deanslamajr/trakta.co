import React from 'react';
import classnames from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import {
  MdArrowBack,
  MdMic,
  MdCheck,
  MdPlayArrow,
  MdStop,
  MdAdd
} from 'react-icons/lib/md'

import styles from './styles.css';

const red = 'rgb(246, 81, 29)'
const green = 'rgb(151, 204, 4)'
const blue = 'rgb(0, 138, 206)'

function renderBackButton () {
  return (<MdArrowBack className={styles.icon} size={50} color={red} />)
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
  return (<MdStop className={styles.playIcon} size={60} color={red} />)
}

function renderAddButton () {
  return (<MdAdd className={styles.icon} size={50} color={green} />)
}

/**
 * render a button
 * @param {oneOf[buttonMappings]} type the content definition enum
 * @param {oneOf['left', 'center', 'right']} position where to position the button on the navbar
 * @param {function} cb function to invoke on a click action
 */
function renderButton (type, position, cb) {
  const Icon = buttonMappings[type]

  return (
    <div className={classnames(styles.button, styles[position])} onClick={cb}>
      <Icon />
    </div>
  )
}

const buttonMappings = {
  RECORD: renderRecordButton,
  CHECK: renderCheckButton,
  PLAY: renderPlayButton,
  STOP: renderStopButton,
  ADD: renderAddButton,
  BACK: renderBackButton
}

class TopNav extends React.Component {
  constructor() {
    super();

    this.state = {
      right: null,
      center: null
    };

    this.onBackClick = this.onBackClick.bind(this);
    this.addItemToNavBar = this.addItemToNavBar.bind(this);
  }

  onBackClick() {
    window.history.back();
  }

  addItemToNavBar(newCenterNode, newRightNode) {
    let centerNode
    if (newCenterNode === null) {
      centerNode = null
    }
    else if (newCenterNode === undefined) {
      centerNode = this.state.center
    }
    else {
      centerNode = newCenterNode
    }

    let rightNode
    if (newRightNode === null) {
      rightNode = null
    }
    else if (newRightNode === undefined) {
      rightNode = this.state.right
    }
    else {
      rightNode = newRightNode
    }

    this.setState({
      center: centerNode,
      right: rightNode
    })
  }

  render() {
    const rightButtonConfig = this.state.right;
    const centerButtonConfig = this.state.center;

    return (
      <div>
        {
          this.props.render(this.addItemToNavBar)
        }

        <div className={styles.container} >
          {/* { renderBackButton('left', this.onBackClick) } */}
          { renderButton('BACK', 'left', this.onBackClick) }

           { centerButtonConfig && renderButton(centerButtonConfig.type, 'center', centerButtonConfig.cb) }  
           { rightButtonConfig && renderButton(rightButtonConfig.type, 'right', rightButtonConfig.cb) } 

        </div>
      </div>
    );
  }
}

export { TopNav }

export default withStyles(styles)(TopNav);