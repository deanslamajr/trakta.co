import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import axios from 'axios';
import classnames from 'classnames';

import config from '../../../../config';

import * as selectors from '../../../reducers';

import { fetchInstances, setName as setTrakName } from '../../../actions/trak';
import { reset as resetSampleLoaderState } from '../../../actions/samples';

import SampleInstances from '../../../../client/components/SampleInstances';
import InstancePlaylist from '../../../../client/components/InstancePlaylist';

import ProgressRing from '../AsyncProgressRing'

import styles from './styles.css';

class MainRoute extends React.Component {
  constructor(props) {
    super(props);

    this._showContribute = this._showContribute.bind(this);
    this._renderLoadingComponent = this._renderLoadingComponent.bind(this);
    this._renderErrorComponent = this._renderErrorComponent.bind(this);
  }

  _showContribute() {
    //@todo have this show a menu of contribution options, which would include <Recorder> among others
    this.props.resetSampleLoaderState();
    this.props.history.push('/recorder');
  }

  _renderLoadingComponent() {
    const progress = this.props.finishedTasks / this.props.totalTasks;

    return (
      <div className={styles.spinner}>
        <ProgressRing radius={50} stroke={2} progress={progress} />
      </div>
    )
  }

  _renderErrorComponent(clickHandler) {
    return (
      <div onClick={clickHandler} className={classnames(styles.error, styles.button, styles.centerButton)}>
        <div className={classnames(styles.icon)}>&#9888;</div>
      </div>
    );
  }

  componentDidMount() {
    console.log('this.props.instances')
    console.dir(this.props.instances)
    
    if (this.props.match.params.trakName) {
      // @todo handle the case where a non existant trakName is passed

      // verify that we have updated the store to the correct trakName
      if(this.props.trakName !== this.props.match.params.trakName) {
        this.props.setTrakName(this.props.match.params.trakName);
      }
      this.props.fetchInstances();
    }
    // @case - url navigation without trakName in path
    else {
      // @todo
      // fetch a random track??
      return this.props.history.push('/new');
    }
  }

  _renderContributeComponent() {
    return (
      <div className={classnames(styles.contribute, styles.button, styles.bottomButton)} onClick={this._showContribute}>
        <span className={styles.icon}>contribute</span>
      </div>
    )
  }

  render() {
    console.log('this.props.isLoading')
    console.dir(this.props.isLoading)
    return (
      <div className={styles.container}>
        <Helmet>
          <title>{`${config('appTitle')}`}</title>
        </Helmet>

        <div className={styles.canvasContainer}>
          <div className={styles.meter}>
            <span className={styles.startTime}>{this.props.trackDimensions.startTime}</span>
            <span className={styles.endTime}>{this.props.trackDimensions.length}</span>
          </div>

          <div className={styles.label}>
            {/* Play button  */}
            <InstancePlaylist renderErrorComponent={this._renderErrorComponent} />
            { !this.props.isLoading && this._renderContributeComponent() }
          </div>
          
          <SampleInstances />
        </div>
         { this.props.isLoading && this._renderLoadingComponent() } 
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    isLoading: selectors.isLoading(state),
    trackDimensions: selectors.getTrackDimensions(state),
    totalTasks: selectors.getTotalTasks(state),
    finishedTasks: selectors.getFinishedTasks(state),
    instances: selectors.getInstances(state),
    trakName: selectors.getTrakName(state)
  };
};

const mapActionsToProps = {
  fetchInstances,
  setTrakName,
  resetSampleLoaderState
};

export default compose(
  withStyles(styles),
  connect(mapStateToProps, mapActionsToProps)
)(MainRoute);

export { MainRoute }