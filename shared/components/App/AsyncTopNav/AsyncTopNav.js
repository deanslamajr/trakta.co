import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

import config from '../../../../config';

import * as selectors from '../../../reducers';

import styles from './styles.css';


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
    const RightButton = this.state.right;
    const CenterButton = this.state.center;

    return (
      <div>
        {
          this.props.render(this.addItemToNavBar)
        }
        <div className={styles.container}>
          <button onClick={this.onBackClick}>Back</button>
          { CenterButton }
          { RightButton }
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