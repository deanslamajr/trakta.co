import React from 'react';
import Tone from 'tone';

import config from '../../../config';

const baseUrl = config('s3SampleBucket');

const loadState = {
  LOADING: 1,
  SUCCESS: 2,
  ERROR: 3
};

const playersCache = {};
const bufferCache = {};

function loadInstanceOntoTransport(instance, samplePlayer, windowStartTime, windowLength) {
  const startTime = instance.start_time - windowStartTime;
  samplePlayer.sync().start(startTime).stop(windowLength - windowStartTime);
}

class InstancePlaylist extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loadState: loadState.LOADING
    };

    this._playArrangement = this._playArrangement.bind(this);
    this._downloadAndArrangeSampleInstances = this._downloadAndArrangeSampleInstances.bind(this);
  }

  onerror(instance, reject, error) {
    // @todo log error
    bufferCache[instance.sample.id] = undefined;
    reject();
  }

  onload(instance, windowStartTime, windowLength, resolve) {
    const buffer = bufferCache[instance.sample.id];
    const samplePlayer = new Tone.Player(buffer);

    // Plugins
    //
    const panVol = new Tone.PanVol(instance.panning, instance.volume);
    //const limiter = new Tone.Limiter(-6)

    samplePlayer.chain(panVol, /*limiter,*/ Tone.Master);

    loadInstanceOntoTransport(instance, samplePlayer, windowStartTime, windowLength);

    // cache the player
    playersCache[instance.sample.id] = samplePlayer;
    resolve();
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
          let sampleBuffer = bufferCache[instance.sample.id];

          if (sampleBuffer) {
            let samplePlayer = playersCache[instance.sample.id];
            if (!samplePlayer) {
              return samplePlayer = playersCache[instance.sample.id] = new Tone.Player(sampleBuffer, () => resolve());
            }

            loadInstanceOntoTransport(instance, samplePlayer, windowStartTime, windowLength)

            resolve();
          }
          else {
            const url = `${baseUrl}/${instance.sample.url}`;
            bufferCache[instance.sample.id] = new Tone.Buffer(url, this.onload.bind(this, instance, windowStartTime, windowLength, resolve), this.onerror.bind(this, instance, reject))
          }
        });
      });

      // The result of loading the sample will determine the look of this component
      Promise.all(tasks)
        .then(() => {
          this.setState({ loadState: loadState.SUCCESS })
        })
        .catch(errors => {
          errors.forEach(console.error);
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

  _playArrangement() {
    if (Tone.Transport.state === 'started') {
      Tone.Transport.stop()
    }
    else {
      Tone.Transport.schedule((time) => {
        Tone.Transport.stop()
      }, this.props.windowLength);

      Tone.Transport.start();
    }
  }

  render () {
    const { 
      renderLoadingComponent, 
      renderPlayButtonComponent } = this.props;

    if (this.state.loadState === loadState.SUCCESS) {
      return renderPlayButtonComponent(this._playArrangement);
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

export default InstancePlaylist;