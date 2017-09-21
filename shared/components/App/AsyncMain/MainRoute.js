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

import Recorder from '../../../../client/components/Recorder';
import SampleInstances from '../../../../client/components/SampleInstances';
import InstancePlaylist from '../../../../client/components/InstancePlaylist';

import styles from './styles.css';

const WINDOW_LENGTH = 20;
const WINDOW_START_TIME = 0;

class MainRoute extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      subview: null,
      instances: [],
      windowLength: WINDOW_LENGTH,
      windowStartTime: WINDOW_START_TIME
    };

    this._showContribute = this._showContribute.bind(this);
    this._showMainMenu = this._showMainMenu.bind(this);
    this._renderLoadingComponent = this._renderLoadingComponent.bind(this);
    this._renderErrorComponent = this._renderErrorComponent.bind(this);

    // this._componentTester = this._componentTester.bind(this);
    // this._componentTester2 = this._componentTester2.bind(this);

    this.views = {
      contribute: Recorder
    }
  }

  /**
   * Retrieve sample instances for current viewport
   */
  _getSampleInstances() {
    this.props.fetchAll();
  }

  _showContribute() {
    this.setState({
      subview: this.views.contribute
    })
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

  _renderMainMenu() {
    // @todo
    // on server, this should only concern itself with displaying a load animation
    // on top of notched track background, showing the correct time labels related to
    // the current track viewport
    return (
      <div className={styles.canvasContainer}>
        <div className={styles.meter}>
          <span className={styles.startTime}>{this.state.windowStartTime}</span>
          <span className={styles.endTime}>{this.state.windowStartTime + this.state.windowLength}</span>
        </div>

        {
          this.state.instances &&
            <div className={styles.label}>
              {/* Play button  */}
              <InstancePlaylist
                instances={this.props.instances}
                renderErrorComponent={this._renderErrorComponent}
                windowLength={this.state.windowLength} 
                windowStartTime={this.state.windowStartTime} />
              {/* Contribute button  */}
              <div className={classnames(styles.contribute, styles.button, styles.bottomButton)} onClick={this._showContribute}>
                <span className={styles.icon}>&#10133;</span>
              </div>
            </div>
        }
        
        { 
          this.state.instances &&
            <SampleInstances 
              instances={this.props.instances}
              windowLength={this.state.windowLength} 
              windowStartTime={this.state.windowStartTime}/>
        }
      </div>
    )
  }

  _showMainMenu() {
    this.setState({ subview: null })
    this._getSampleInstances();
  }

  componentDidMount() {
    this._getSampleInstances();
  }

  // _componentTester() {
  //   return <div>/</div>
  // }

  // _componentTester2() {
  //   return <div>taco</div>
  // }

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

         {/* <Switch>
          <Route exact path="/" component={this._componentTester} />
          <Route path="/track" component={this._componentTester2} />
          <Route path="/recorder" component={Recorder} />
          <Route path="/cleanup" component={this._componentTester2} />
          <Route path="/stage" component={this._componentTester2} />
        </Switch> */}

        { Subview
            ? <Subview 
                showMainMenu={this._showMainMenu}
                taco={6}
                instances={this.props.instances}
                windowLength={windowLength} 
                windowStartTime={windowStartTime}
                />
            : this._renderMainMenu()
        }
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