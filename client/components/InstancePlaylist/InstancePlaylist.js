import React from 'react';
import Tone from 'tone';
import classnames from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

import config from '../../../config';

import styles from './InstancePlaylist.css';

const baseUrl = config('s3SampleBucket');

const loadState = {
  LOADING: 1,
  SUCCESS: 2,
  ERROR: 3
};

const playersCache = {};
const bufferCache = {};

function loadInstanceOntoTransport(samplePlayer, startTime, endTime, windowLength) {
  // sample starts before the window
  if (startTime < 0) {
    startTime = 0;
  }

  // sample extends past window
  if(endTime > windowLength) {
    endTime = windowLength;
  }

  samplePlayer.sync().start(startTime).stop(endTime);
}

function onInstanceLoadError(instance, reject, error) {
  // @todo log error
  bufferCache[instance.sample.id] = undefined;
  reject();
}

function onInstanceLoadSuccess(instance, windowStartTime, windowLength, resolve) {
  const buffer = bufferCache[instance.sample.id];

  let samplePlayer;

  let startTime = instance.start_time - windowStartTime;
  let endTime = startTime + instance.sample.duration;

  // discard if sampleInstance is outside of the current window
  if (endTime <= 0 || startTime >= windowLength) {
    return resolve();
  }

  // if sample starts before the window
  // slice the sample buffer to start at the proper time
  if (startTime < 0) {
    const sampleSeekTime = windowStartTime - instance.start_time;
    const shortenedBuffer = buffer.slice(sampleSeekTime);
    samplePlayer = new Tone.Player(shortenedBuffer);
  }
  else {
    samplePlayer = new Tone.Player(buffer);
  }

  // Plugins
  //
  const panVol = new Tone.PanVol(instance.panning, instance.volume);
  //const limiter = new Tone.Limiter(-6)
  samplePlayer.chain(panVol, /*limiter,*/ Tone.Master);

  loadInstanceOntoTransport(samplePlayer, startTime, endTime, windowLength);

  // cache the player
  playersCache[instance.sample.id] = samplePlayer;
  resolve();
}

function playArrangement(windowLength) {
  if (Tone.Transport.state === 'started') {
    Tone.Transport.stop()
  }
  else {
    Tone.Transport.schedule((time) => {
      Tone.Transport.stop()
    }, windowLength);

    Tone.Transport.start();
  }
}

function renderPlayComponent(windowLength) {
  return (
    <div className={classnames(styles.play, styles.button, styles.topButton)} onClick={playArrangement.bind(null, windowLength)}>
      <span className={styles.icon}>&#128266;</span>
    </div>
  );
}

class InstancePlaylist extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loadState: loadState.LOADING
    };

    this._downloadAndArrangeSampleInstances = this._downloadAndArrangeSampleInstances.bind(this);
  }

  _downloadAndArrangeSampleInstances(instances) {
    const {
      windowStartTime, 
      windowLength
    } = this.props;

    if (instances && instances.length) {
      this.setState({ loadState: loadState.LOADING })

      // clear the transport
      Tone.Transport.cancel();

      // Load the samples
      const tasks = instances.map(instance => {
        return new Promise((resolve, reject) => {
          const startTime = instance.start_time - windowStartTime;
          const endTime = startTime + instance.sample.duration;

          // discard if sample instance is outside of the current window
          if (endTime <= 0 || startTime >= windowLength) {
            return resolve();
          }

          let sampleBuffer = bufferCache[instance.sample.id];

          if (sampleBuffer) {
            let samplePlayer = playersCache[instance.sample.id];
            if (!samplePlayer) {
              // @todo can this path be reached??
              throw new Error('samplePlayer doesnt exist in playersCache!');
              //onInstanceLoadSuccess(instance, windowStartTime, windowLength, resolve);
            }

            loadInstanceOntoTransport(samplePlayer, startTime, endTime, windowLength)

            resolve();
          }
          else {
            const url = `${baseUrl}/${instance.sample.url}`;
            bufferCache[instance.sample.id] = new Tone.Buffer(
              url, 
              onInstanceLoadSuccess.bind(this, instance, windowStartTime, windowLength, resolve),
              onInstanceLoadError.bind(this, instance, reject)
            );
          }
        });
      });

      // The result of loading the sample will determine the look of this component
      Promise.all(tasks)
        .then(() => {
          this.setState({ loadState: loadState.SUCCESS })
        })
        .catch(error => {
          // @todo log error
          console.error(error)
          this.setState({ loadState: loadState.ERROR })
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
    const { renderLoadingComponent, windowLength } = this.props;

    if (this.state.loadState === loadState.SUCCESS) {
      return renderPlayComponent(windowLength);
    }
    else if (this.props.instances && this.props.instances.length === 0) {
      return null;
    }
    else if (this.state.loadState === loadState.LOADING) {
      return renderLoadingComponent(this._downloadAndArrangeSampleInstances.bind(this, this.props.instances));
    }
    else {
      return (<div>Error!!!</div>);
    }
  }
}

export default withStyles(styles)(InstancePlaylist)