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
      
    };
  }

  render() {
    return (
      <div className={styles.container}>
        <button>Back</button>
        <button>Ok</button>
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