import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import {
  MdArrowBack,
  MdMic,
  MdCheck,
  MdPlayArrow,
  MdStop,
  MdAdd
} from 'react-icons/lib/md'


import config from '../../../../config';

import * as selectors from '../../../reducers';

import styles from './styles.css';

const color = 'rgba(0, 0, 0, .4)';

function renderBackButton (cb=()=>{}) {
  return (
    <div className={styles.button} onClick={cb}>
      <MdArrowBack className={styles.icon} size={50} color={color} />
    </div>
  )
}

function renderRecordButton (cb=()=>{}) {
  return (
    <div>
      <div className={styles.button} onClick={cb}>
        <MdMic className={styles.icon} size={50} color={color} />
      </div>
    </div>
  )
}

function renderCheckButton (cb=()=>{}) {
  return (
    <div>
      <div className={styles.button} onClick={cb}>
        <MdCheck className={styles.icon} size={50} color={color} />
      </div>
    </div>
  )
}

function renderPlayButton (cb=()=>{}) {
  return (
    <div>
      <div className={styles.button} onClick={cb}>
        <MdPlayArrow className={styles.playIcon} size={60} color={color} />
      </div>
    </div>
  )
}

function renderStopButton (cb=()=>{}) {
  return (
    <div>
      <div className={styles.button} onClick={cb}>
        <MdStop className={styles.playIcon} size={60} color={color} />
      </div>
    </div>
  )
}

function renderAddButton (cb=()=>{}) {
  return (
    <div>
      <div className={styles.button} onClick={cb}>
        <MdAdd className={styles.icon} size={50} color={color} />
      </div>
    </div>
  )
}

const buttonMappings = {
  RECORD: renderRecordButton,
  CHECK: renderCheckButton,
  PLAY: renderPlayButton,
  STOP: renderStopButton,
  ADD: renderAddButton
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
          { renderBackButton(this.onBackClick) }

          { centerButtonConfig && buttonMappings[centerButtonConfig.type](centerButtonConfig.cb) } 
          { rightButtonConfig && buttonMappings[rightButtonConfig.type](rightButtonConfig.cb) }

        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {}
}

export { TopNav }

export default compose(
  withStyles(styles),
  connect(mapStateToProps)
)(TopNav);