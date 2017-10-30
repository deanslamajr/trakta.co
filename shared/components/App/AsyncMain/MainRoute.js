import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import axios from 'axios';
import classnames from 'classnames';

import config from '../../../../config';

import * as selectors from '../../../reducers';
import { fetchAll, setTrakName } from '../../../actions/instances';

import SampleInstances from '../../../../client/components/SampleInstances';
import InstancePlaylist from '../../../../client/components/InstancePlaylist';

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
    // If we just created a new trak, the trakName will be
    // in the response
    if (this.props.match.params.trakName) {
      this.props.setTrakName(this.props.match.params.trakName);
      this.props.fetchAll();
    }
    else {
      // @todo
      // fetch a random track??
      return this.props.history.push('/new');
    }
  }

  render() {
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
            {/* Contribute button  */}
            <div className={classnames(styles.contribute, styles.button, styles.bottomButton)} onClick={this._showContribute}>
              <span className={styles.icon}>&#10133;</span>
            </div>
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
    trackDimensions: selectors.getTrackDimensions(state)
  };
};

const mapActionsToProps = {
  fetchAll,
  setTrakName
};

export default compose(
  withStyles(styles),
  connect(mapStateToProps, mapActionsToProps)
)(MainRoute);

export { MainRoute }