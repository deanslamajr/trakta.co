import React from 'react';
import Tone from 'tone';

import config from '../../../config';

const baseUrl = config('s3SampleBucket');

const loadState = {
  LOADING: 1,
  SUCCESS: 2,
  ERROR: 3
};

const samplesCache = {};

class InstancePlaylist extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loadState: loadState.LOADING
    };

    this._playArrangement = this._playArrangement.bind(this);
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

          let samplePlayer = samplesCache[instance.sample.id];
          if (samplePlayer) {
            samplePlayer.sync().start(startTime).stop(windowLength);
            resolve();
          }
          else {
            const url = `${baseUrl}/${instance.sample.url}`;

            samplePlayer = new Tone.Player(url, () => resolve());

            // Plugins
            //
            const panVol = new Tone.PanVol(instance.panning, instance.volume);
            const limiter = new Tone.Limiter(-6)

            samplePlayer.chain(panVol, limiter, Tone.Master);
            // samplePlayer.chain(panVol, Tone.Master);

            samplePlayer.sync().start(startTime).stop(windowLength - windowStartTime);
            // cache the player
            samplesCache[instance.sample.id] = samplePlayer;
          }
        });
      });

      // The result of loading the sample will determine the look of this component
      Promise.all(tasks)
        .then(() => {
          this.setState({ loadState: loadState.SUCCESS })
        })
        .catch(error => {
          this.setState({ loadState: loadState.ERROR })
        });
    }
  }

  componentWillReceiveProps(nextProps) {
    this._downloadAndArrangeSampleInstances(Array.from(nextProps.instances));
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
      return renderLoadingComponent();
    }
    else {
      return (<div>Error!!!</div>);
    }
  }
}

export default InstancePlaylist;