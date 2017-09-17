import React from 'react';
import Helmet from 'react-helmet';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import axios from 'axios';
import classnames from 'classnames';

import config from '../../../../config';

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

    this.views = {
      contribute: Recorder
    }
  }

  /**
   * Retrieve sample instances for current viewport
   */
  _getSampleInstances() {
    axios.get('/api/sampleInstances')
      .then(({ data }) => {
        this.setState({
          instances: data
        })
      })
      .catch(error => {
        // @todo log
        console.error(error);
      });
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
                instances={this.state.instances}
                renderLoadingComponent={this._renderLoadingComponent}
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
              instances={this.state.instances}
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

  render() {
    const {
      instances,
      windowLength,
      windowStartTime
    } = this.state;

    console.log('MainRoute: this.state.instances:')
    console.dir(this.state.instances)

    const Subview = this.state.subview;

    return (
      <div className={styles.container}>
        <Helmet>
          <title>{`recorder - ${config('appTitle')}`}</title>
        </Helmet>
        { Subview
            ? <Subview 
                showMainMenu={this._showMainMenu}
                taco={6}
                instances={instances}
                windowLength={windowLength} 
                windowStartTime={windowStartTime}
                />
            : this._renderMainMenu()
        }
      </div>
    );
  }
}

export default withStyles(styles)(MainRoute)

export { MainRoute }