import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import axios from 'axios';
import classnames from 'classnames';

// import Switch from 'react-router-dom/Switch';
// import Route from 'react-router-dom/Route';

import config from '../../../../config';

import * as selectors from '../../../reducers';
import { fetchAll } from '../../../actions/instances';

import SampleInstances from '../../../../client/components/SampleInstances';
import InstancePlaylist from '../../../../client/components/InstancePlaylist';

import styles from './styles.css';

const WINDOW_LENGTH = 10;
const WINDOW_START_TIME = 0;

class MainRoute extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      subview: null,
      windowLength: WINDOW_LENGTH,
      windowStartTime: WINDOW_START_TIME
    };

    this._showContribute = this._showContribute.bind(this);
    this._renderLoadingComponent = this._renderLoadingComponent.bind(this);
    this._renderErrorComponent = this._renderErrorComponent.bind(this);
  }

  /**
   * Retrieve sample instances for current viewport
   */
  _getSampleInstances() {
    this.props.fetchAll();
  }

  _showContribute() {
    //@todo have this show a menu of contribution options, which would include <Recorder> among others
    this.props.history.push('/recorder');
  }

  _renderLoadingComponent(clickHandler) {
    return (
      <div onClick={clickHandler} className={classnames(styles.loading, styles.button, styles.centerButton)}>
        <div className={classnames(styles.icon, styles.loadSpinner)}></div>
      </div>
    );
  }

  _renderErrorComponent(clickHandler) {
    return (
      <div onClick={clickHandler} className={classnames(styles.error, styles.button, styles.centerButton)}>
        <div className={classnames(styles.icon)}>&#9888;</div>
      </div>
    );
  }

  componentDidMount() {
    this._getSampleInstances();
  }

  render() {
    const {
      windowLength,
      windowStartTime
    } = this.state;

    const Subview = this.state.subview;

    return (
      <div className={styles.container}>
        <Helmet>
          <title>{`recorder - ${config('appTitle')}`}</title>
        </Helmet>

        {/* 
            // @todo
            // on server, this should only concern itself with displaying a load animation
            // on top of notched track background, showing the correct time labels related to
            // the current track viewport 
        */}

        <div className={styles.canvasContainer}>
          <div className={styles.meter}>
            <span className={styles.startTime}>{this.state.windowStartTime}</span>
            <span className={styles.endTime}>{this.state.windowStartTime + this.state.windowLength}</span>
          </div>

          <div className={styles.label}>
            {/* Play button  */}
            <InstancePlaylist
              renderErrorComponent={this._renderErrorComponent}
              windowLength={this.state.windowLength} 
              windowStartTime={this.state.windowStartTime} />
            {/* Contribute button  */}
            <div className={classnames(styles.contribute, styles.button, styles.bottomButton)} onClick={this._showContribute}>
              <span className={styles.icon}>&#10133;</span>
            </div>
          </div>
          
          <SampleInstances
            windowLength={this.state.windowLength} 
            windowStartTime={this.state.windowStartTime}/>
        </div>

        { this.props.isLoading && this._renderLoadingComponent() }
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    isLoading: selectors.isLoading(state),
    instances: selectors.getInstances(state)
  };
};

const mapActionsToProps = {
  fetchAll
};

export default compose(
  withStyles(styles),
  connect(mapStateToProps, mapActionsToProps)
)(MainRoute);

export { MainRoute }