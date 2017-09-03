import React from 'react';
import Helmet from 'react-helmet';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import axios from 'axios';

import config from '../../../../config';

import Recorder from '../../../../client/components/Recorder';
import SampleInstances from '../../../../client/components/SampleInstances';
import InstancePlaylist from '../../../../client/components/InstancePlaylist';

import styles from './styles.css';

// @todo dynamically generate these
const windowStartTime = 0;
const windowLength = 5;

class MainRoute extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isClient: false,
      subview: null,
      instances: []
    };

    this._showContribute = this._showContribute.bind(this);
    this._showMainMenu = this._showMainMenu.bind(this);
    this._renderLoadingComponent = this._renderLoadingComponent.bind(this);
    this._renderPlayComponent = this._renderPlayComponent.bind(this);

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

  _renderLoadingComponent() {
    return (<div className={styles.loadingButton}>Loading</div>);
  }

  _renderPlayComponent(clickHandler) {
    return (<div className={styles.playButton} onClick={clickHandler}>&#128266;</div>);
  }

  _renderMainMenu() {
    // on server, this should only concern itself with displaying a load animation
    // on top of notched track background, showing the correct time labels related to
    // the current track viewport
    return (
      <div className={styles.canvasContainer}>
        <div className={styles.label}>
          <InstancePlaylist
            instances={this.state.instances}
            renderLoadingComponent={this._renderLoadingComponent}
            renderPlayButtonComponent={this._renderPlayComponent}
            windowLength={windowLength} 
            windowStartTime={windowStartTime} />
          <div className={styles.contributeButton} onClick={this._showContribute}>&#10133;</div>
        </div>
        
        { this.state.isClient &&
            <SampleInstances 
              instances={this.state.instances}
              windowLength={windowLength} 
              windowStartTime={windowStartTime}/>
        }
      </div>
    )
  }

  _showMainMenu() {
    this._getSampleInstances();

    this.setState({
      subview: null
    })
  }

  componentDidMount() {
    this.setState({ isClient: true });
    this._getSampleInstances();
  }

  render() {
    const Subview = this.state.subview;

    return (
      <div className={styles.container}>
        <Helmet>
          <title>{`recorder - ${config('appTitle')}`}</title>
        </Helmet>
        { Subview
            ? <Subview showMainMenu={this._showMainMenu} />
            : this._renderMainMenu()
        }
      </div>
    );
  }
}

export default withStyles(styles)(MainRoute)

export { MainRoute }