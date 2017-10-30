import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import Tone from 'tone';
import classnames from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import debounce from 'debounce';
import isEqual from 'lodash.isequal';

import config from '../../../config';

import * as selectors from '../../../shared/reducers';
import { startFetchSample, endFetchSample } from '../../../shared/actions/samples';

import styles from './InstancePlaylist.css';

const baseUrl = config('s3SampleBucket');

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

function prepTransport(trackStartTime, trackLength) {
  Tone.Transport.loop = true;
  Tone.Transport.position = Tone.Transport.loopStart = trackStartTime >= 0
    ? trackStartTime
    : 0;
  Tone.Transport.loopEnd = trackStartTime >= 0
    ? trackLength + trackStartTime
    : trackLength;

  // clear the transport
  Tone.Transport.cancel();
}

function loadSample(trackStartTime, trackLength, instance) {
  return new Promise((resolve, reject) => {
    const url = `${baseUrl}/${instance.sample.url}`;
    bufferCache[instance.sample.id] = new Tone.Buffer(
      url, 
      onInstanceLoadSuccess.bind(null, instance, trackStartTime, trackLength, resolve),
      onInstanceLoadError.bind(null, instance, reject)
    );
  });
}

function loadBuffer(buffer, stagedSample, trackStartTime) {
  return new Promise((resolve, reject) => {
    const samplePlayer = new Tone.Player(buffer);

    const playerStartTime = stagedSample.startTime - trackStartTime;

    addPluginsToPlayer(samplePlayer, stagedSample.volume, stagedSample.panning)
    syncPlayerToTransport(samplePlayer, playerStartTime);
    resolve();
  })
}

class InstancePlaylist extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null
    }

    // this debounce slows down invocation just enough so that redux store can be updated properly from form
    this._debouncedDownloadAndArrangeSampleInstances = debounce(this._downloadAndArrangeSampleInstances.bind(this), 1000);
    this._downloadAndArrangeSampleInstances = this._downloadAndArrangeSampleInstances.bind(this);
  }

  _downloadAndArrangeSampleInstances(instances) {
    const {
      startTime: trackStartTime, 
      length: trackLength
    } = this.props.trackDimensions;

    this.props.startFetchSample()

    prepTransport(trackStartTime, trackLength)

    // Load the samples
    const tasks = instances.map(loadSample.bind(null, trackStartTime, trackLength))

    // if buffer exists, add the staged sample to the track
    if (this.props.buffer) {
      tasks.push(loadBuffer(this.props.buffer, this.props.stagedSample, trackStartTime))
    }

    // The result of loading the sample will determine the look of this component
    Promise.all(tasks)
      .then(() => {
        this.props.endFetchSample()
        this.setState({ error: null })
      })
      .catch(error => {
        // @todo log error
        console.error(error)
        this.setState({ error })
      });
  }

  componentWillReceiveProps(nextProps) {
    const instancesHaveChanged = !isEqual(this.props.instances, nextProps.instances);
    const stagedSamplePropsHaveChanged = !isEqual(this.props.stagedSample, nextProps.stagedSample);

    if (instancesHaveChanged || stagedSamplePropsHaveChanged) {
      this._debouncedDownloadAndArrangeSampleInstances(nextProps.instances);
    }
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
  startFetchSample,
  endFetchSample
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