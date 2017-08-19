import React from 'react';
import Helmet from 'react-helmet';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import axios from 'axios';

import config from '../../../../config';

import Recorder from '../../../../client/components/Recorder';
import TrackViewport from '../../../../client/components/TrackViewport';

import calculateInstanceRectangles from '../../../../client/components/calculateInstanceRectangles';

import styles from './styles.css';

class MainRoute extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isClient: false,
      subview: null,
      rowsOfRectangles: [ [] ]
    };

    this._showContribute = this._showContribute.bind(this);
    this._showMainMenu = this._showMainMenu.bind(this);

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
        const samples = data.map(instance => {
          return {
            start_time: instance.start_time,
            duration: instance.sample.duration,
            id: instance.id
          }
        });

        const rowsOfRectangles = calculateInstanceRectangles(0, 5, samples);
        this.setState({ rowsOfRectangles })
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

  _renderMainMenu() {
    return (
      <div className={styles.canvasContainer}>
        <div className={styles.label}>
          <div className={styles.playButton}>&#128266;</div>
          <div className={styles.contributeButton} onClick={this._showContribute}>&#10133;</div>
        </div>
        { this.state.isClient && <TrackViewport rowsOfRectangles={this.state.rowsOfRectangles} /> }
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