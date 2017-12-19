import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import {
  FaChevronLeft,
  FaMicrophone,
  FaCheck,
  FaPlay,
  FaStop,
  FaPlus } from 'react-icons/lib/fa';

import config from '../../../../config';

import * as selectors from '../../../reducers';

import styles from './styles.css';

function renderBackButton (cb=()=>{}) {
  return (
    <div className={styles.button}>
      <FaChevronLeft size={100} color='rgba(0, 0, 0, .4)' onClick={cb} />
    </div>
  )
}

function renderRecordButton (cb=()=>{}) {
  return (
    <div>
      <div className={styles.button}>
        <FaMicrophone size={100} color='rgba(0, 0, 0, .4)' onClick={cb} />
      </div>
    </div>
  )
}

function renderCheckButton (cb=()=>{}) {
  return (
    <div>
      <div className={styles.button}>
        <FaCheck size={100} color='rgba(0, 0, 0, .4)' onClick={cb} />
      </div>
    </div>
  )
}

function renderPlayButton (cb=()=>{}) {
  return (
    <div>
      <div className={styles.button}>
        <FaPlay size={100} color='rgba(0, 0, 0, .4)' onClick={cb} />
      </div>
    </div>
  )
}

function renderStopButton (cb=()=>{}) {
  return (
    <div>
      <div className={styles.button}>
        <FaStop size={100} color='rgba(0, 0, 0, .4)' onClick={cb} />
      </div>
    </div>
  )
}

function renderAddButton (cb=()=>{}) {
  return (
    <div>
      <div className={styles.button}>
        <FaPlus size={100} color='rgba(0, 0, 0, .4)' onClick={cb} />
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