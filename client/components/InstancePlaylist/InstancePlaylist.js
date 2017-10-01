import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import Tone from 'tone';
import classnames from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import debounce from 'debounce';

import config from '../../../config';

import * as selectors from '../../../shared/reducers';
import { startLoadingState, endLoadingState } from '../../../shared/actions/ui';

import styles from './InstancePlaylist.css';

const baseUrl = config('s3SampleBucket');

const playersCache = {};
const bufferCache = {};

function addPluginsToPlayer(samplePlayer, volume, panning) {
  // Plugins
  //
  const panVol = new Tone.PanVol(panning, volume);
  //const limiter = new Tone.Limiter(-6)

  samplePlayer.chain(panVol, /*limiter,*/ Tone.Master);
}

function syncPlayerToTransport(samplePlayer, playerStartTime) {
  samplePlayer.sync().start(playerStartTime)
}

function onInstanceLoadError(instance, reject, error) {
  // @todo log error
  bufferCache[instance.sample.id] = undefined;
  reject();
}

function onInstanceLoadSuccess(instance, trackStartTime, trackLength, resolve) {
  const buffer = bufferCache[instance.sample.id];

  const samplePlayer = new Tone.Player(buffer);

  let playerStartTime = instance.start_time - trackStartTime;

  addPluginsToPlayer(samplePlayer, instance.volume, instance.panning)
  syncPlayerToTransport(samplePlayer, playerStartTime);

  // cache the player
  playersCache[instance.sample.id] = samplePlayer;
  resolve();
}

function playArrangement() {
  if (Tone.Transport.state === 'started') {
    Tone.Transport.stop()
  }
  else {
    Tone.Transport.start();
  }
}

function renderPlayComponent() {
  return (
    <div className={classnames(styles.play, styles.button, styles.topButton)} onClick={playArrangement}>
      <span className={styles.icon}>&#128266;</span>
    </div>
  );
}

class InstancePlaylist extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null
    }

    // this debounce slows down invocation just enough so that redux store can be updated properly from form
    this._downloadAndArrangeSampleInstances = debounce(this._downloadAndArrangeSampleInstances.bind(this), 1000);
  }

  _downloadAndArrangeSampleInstances(instances) {
    const {
      startTime: trackStartTime, 
      length: trackLength
    } = this.props.trackDimensions;

    // prep global transport
    Tone.Transport.loop = true;
    Tone.Transport.position = Tone.Transport.loopStart = trackStartTime >= 0
      ? trackStartTime
      : 0;
    Tone.Transport.loopEnd = trackStartTime >= 0
      ? trackLength + trackStartTime
      : trackLength;

    if (instances && instances.length) {
      // clear the transport
      Tone.Transport.cancel();

      // Load the samples
      const tasks = instances.map(instance => {
        return new Promise((resolve, reject) => {
          let sampleBuffer = bufferCache[instance.sample.id];

          if (sampleBuffer) {
            let samplePlayer = playersCache[instance.sample.id];
            if (!samplePlayer) {
              // @todo can this path be reached??
              throw new Error('samplePlayer doesnt exist in playersCache!');
              //onInstanceLoadSuccess(instance, trackStartTime, trackLength, resolve);
            }

            const startTime = instance.start_time - trackStartTime;

            syncPlayerToTransport(samplePlayer, startTime);

            resolve();
          }
          else {
            const url = `${baseUrl}/${instance.sample.url}`;
            bufferCache[instance.sample.id] = new Tone.Buffer(
              url, 
              onInstanceLoadSuccess.bind(this, instance, trackStartTime, trackLength, resolve),
              onInstanceLoadError.bind(this, instance, reject)
            );
          }
        });
      });

      // if buffer exists, add the staged sample to the track
      if (this.props.buffer) {
        const addBufferToTrack = new Promise((resolve, reject) => {
          const samplePlayer = new Tone.Player(this.props.buffer);

          const playerStartTime = this.props.stagedSample.startTime - trackStartTime;

          addPluginsToPlayer(samplePlayer, this.props.stagedSample.volume, this.props.stagedSample.panning)
          syncPlayerToTransport(samplePlayer, playerStartTime);
        });

        tasks.push(addBufferToTrack);
      }

      // The result of loading the sample will determine the look of this component
      Promise.all(tasks)
        .then(() => {
          this.setState({ error: null })
          this.props.endLoadingState();
        })
        .catch(error => {
          // @todo log error
          console.error(error)
          this.setState({ error })
        });
    }
  }

  componentWillReceiveProps(nextProps) {
    this._downloadAndArrangeSampleInstances(nextProps.instances);
  }

  componentDidMount() {
    this._downloadAndArrangeSampleInstances(this.props.instances);
  }

  render () {
    if (this.state.error) {
      return this.props.renderErrorComponent(this._downloadAndArrangeSampleInstances.bind(this, this.props.instances));
    }
    else if (!this.props.isLoading) {
      return renderPlayComponent();
    }
    else {
      return null;
    }
  }
}

const mapActionsToProps = {
  startLoadingState,
  endLoadingState
};

function mapStateToProps(state, ownProps) {
  return {
    isLoading: selectors.isLoading(state),
    instances: selectors.getInstances(state),
    stagedSample: selectors.getStagedSample(state),
    trackDimensions: selectors.getTrackDimensions(state)
  };
}

export default compose(
  withStyles(styles),
  connect(mapStateToProps, mapActionsToProps)
)(InstancePlaylist);