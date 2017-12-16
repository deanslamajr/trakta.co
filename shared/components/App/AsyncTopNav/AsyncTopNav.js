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
      nodes: []
    };

    this.onBackClick = this.onBackClick.bind(this);
    this.addItemToNavBar = this.addItemToNavBar.bind(this);
  }

  onBackClick() {
    window.history.back();
  }

  addItemToNavBar(node, clearAllButBack=true) {
    if (clearAllButBack) {
      this.setState({
        nodes: [node]
      })
    }
    else {
      const currentNodes = this.state.nodes
      const combinedSetOfNodes = currentNodes.concat([node])

      this.setState({
        nodes: combinedSetOfNodes
      })
    }
  }

  render() {
    const ActionButtons = this.state.nodes;

    return (
      <div>
        {
          this.props.render(this.addItemToNavBar)
        }
        <div className={styles.container}>
          <button onClick={this.onBackClick}>Back</button>
          {
            ActionButtons
          }
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