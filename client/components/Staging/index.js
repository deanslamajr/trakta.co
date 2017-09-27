import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { compose } from 'redux';
import { connect } from 'react-redux';
import axios from 'axios';
import classnames from 'classnames';
import Tone from 'tone';

import InstancePlaylist from '../InstancePlaylist';
import SampleInstances from '../SampleInstances';

import * as selectors from '../../../shared/reducers';
import { setStagedSample } from '../../../shared/actions/recorder';

import styles from './staging.css'

const windowLength = 20;
const windowStartTime = 0;

class Staging extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      isSaving: false,
      windowLength,
      windowStartTime
    }

    this._saveRecording = this._saveRecording.bind(this);
    this._renderTrackPlayer = this._renderTrackPlayer.bind(this);
    this._getBlobFromObjectUrl = this._getBlobFromObjectUrl.bind(this);
  }

  handleChange (type, event) {
    let parsedValue = parseFloat(event.target.value);
    if (Number.isNaN(parsedValue)) {
      parsedValue = 0;
    }

    this.props.setStagedSample({ [type]: parsedValue });
  }

  _saveRecording(event) {
    const {
      startTime,
      volume,
      panning
    } = this.props.stagedSample;

    // prevent page refresh
    event.preventDefault();

    // show save animation
    this.setState({ isSaving: true })

    const data = new FormData();
    // @todo
    //data.append('file', new File([this.props.blob], 'sample.mp3'));

    const config = {
      onUploadProgress: (progressEvent) => {
        console.log(
          `upload progress: ${Math.round(progressEvent.loaded * 100 / progressEvent.total)}`,
        );
      },
    };

    const duration = this.state.buffer.get().duration;

    const queryString = `?startTime=${startTime}&duration=${duration}&volume=${volume}&panning=${panning}`;

    this._getBlobFromObjectUrl()
      .then(data => axios.post(`/api/sample${queryString}`, data, config))
      .then(() => this.props.history.push('/track'))
      .catch((err) => {
        // @todo log error
        console.error(err);
        // this.props.failureCB
      });
  }

  /**
   * getting a blob from an objectUrl is tricky :)
   * this method contains the trick
   */
  _getBlobFromObjectUrl() {
    return axios.get(this.props.objectUrl, { responseType: 'blob' })
      .then(({ data }) => data)
  }

  _renderErrorComponent(clickHandler) {
    return (
      <div onClick={clickHandler} className={classnames()}>
        <div className={classnames(styles.icon)}>&#9888;</div>
      </div>
    );
  }

  componentDidMount() {
    const buffer = new Tone.Buffer(this.props.objectUrl,
      // success
      () => {
        this.setState({ buffer })
      },
      // error
      // @todo log, set error view state (w/ try again functionality)
      error => {
        console.error(error);
      }
    );
  }

  _renderTrackPlayer() {
    const {
      windowLength,
      windowStartTime,
      buffer
    } = this.state;

    const stagedSample = {
      buffer,
      startTime: this.props.stagedSample.startTime
    };

    return (
      <div>
        <div className={styles.label}>
          {/* Play button  */}
          <InstancePlaylist
            renderErrorComponent={this._renderErrorComponent}
            windowLength={windowLength} 
            windowStartTime={windowStartTime}
            buffer={buffer}
            />
        </div>

        <SampleInstances 
          windowLength={windowLength} 
          windowStartTime={windowStartTime}
          stagedSample={stagedSample}
          />
      </div>
    );
  }

  render () {
    const {
      startTime,
      volume,
      panning
    } = this.props.stagedSample;

    return (
      <div>
        <form className={styles.container} onSubmit={this._saveRecording}>
          <label htmlFor='startTime'>startTime</label>
          <input 
            id='startTime'
            value={startTime}
            onChange={this.handleChange.bind(this, 'startTime')}
            placeholder='startTime'
            className={styles.formInput} />
          
          <label htmlFor='volume'>volume (-infinity to 0)</label>
          <input id='volume'
            value={volume}
            onChange={this.handleChange.bind(this, 'volume')}
            placeholder='volume'
            className={styles.formInput} />
          
          <label htmlFor='panning'>panning (-1 to 1)</label>
          <input id='panning'
            value={panning}
            onChange={this.handleChange.bind(this, 'panning')}
            placeholder='panning'
            className={styles.formInput} />
          
          <input type='submit' value='Create Instance' className={classnames(styles.formInput, { [styles.formSaving]: this.state.isSaving })} />
          
          <div className={classnames({ [styles.loadSpinner]: this.state.isSaving })} /> 
        </form>

        {
          this.state.buffer
            ? this._renderTrackPlayer()
            : null
        }
         
      </div>
    )
  }
}

const mapActionsToProps = {
  setStagedSample
};

function mapStateToProps(state) {
  return { 
    objectUrl: selectors.getStagedObjectUrl(state),
    stagedSample: selectors.getStagedSample(state)
  }
}

export { Staging }

export default compose(
  withStyles(styles),
  connect(mapStateToProps, mapActionsToProps)
)(Staging);
