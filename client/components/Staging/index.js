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
import { updateTrackDimensionsWithAdditionalSample } from '../../../shared/actions/instances';

import styles from './staging.css'

function isNotANumber(unknown) {
  return isNaN(parseFloat(unknown))
}

function validateData(absoluteStartTime, duration, volume, panning) {
  if (isNotANumber(absoluteStartTime) || isNotANumber(duration) || isNotANumber(volume) || isNotANumber(panning)) {
    throw new Error('Malformed submit data')
  }
}

class Staging extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      isSaving: false
    }

    this._saveRecording = this._saveRecording.bind(this);
    this._renderTrackPlayer = this._renderTrackPlayer.bind(this);
    this._renderSubmitButton = this._renderSubmitButton.bind(this);
    this._getBlobFromObjectUrl = this._getBlobFromObjectUrl.bind(this);
    this._updateTrack = this._updateTrack.bind(this);
  }

  _updateTrack(stagedSample) {
    const latestStagedSample = stagedSample || this.props.stagedSample

    this.props.updateTrackDimensionsWithAdditionalSample({
      // weird shape that mocks the shape returned from DB query for sampleInstances
      start_time: latestStagedSample.startTime,
      sample: { duration: latestStagedSample.duration }
    })
  }

  _handleChange (type, event) {
    let parsedValue = parseFloat(event.target.value);
    if (Number.isNaN(parsedValue)) {
      return;
    }

    if (type === 'startTime') {
      this.setState({
        updateTrack: true
      }, () => {
        this.props.setStagedSample({ [type]: parsedValue })
      })
    }

    this.props.setStagedSample({ [type]: parsedValue })
  }

  _saveRecording(event) {
    const {
      startTime: stagedSampleStartTime,
      volume,
      panning,
      duration
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

    //const absoluteStartTime = this.props.trackDimensions.startTime + stagedSampleStartTime

    // validate that data is properly formatted
    // @todo handle invalid data state gracefully
    validateData(/*absoluteStartTime*/stagedSampleStartTime, duration, volume, panning)

    const queryString = `?startTime=${stagedSampleStartTime/*absoluteStartTime*/}&duration=${duration}&volume=${volume}&panning=${panning}`;

    this._getBlobFromObjectUrl()
      .then(data => axios.post(`/api/sample${queryString}`, data, config))
      .then(() => {
        this.props.setStagedSample({
          startTime: 0,
          volume: 0,
          panning: 0,
          duration: 0
        });
        this.props.history.push('/track');
      })
      .catch((err) => {
        // @todo log error
        // @todo handle this gracefully
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

  // initialize the buffer everytime the user navigates to this page
  componentDidMount() {
    const buffer = new Tone.Buffer(this.props.objectUrl,
      // success
      () => {
        this.setState({ buffer })
        
        const duration = buffer.get().duration;
        this.props.setStagedSample({ duration });

        this._updateTrack()
      },
      // error
      // @todo log, set error view state (w/ try again functionality)
      error => {
        console.error(error);
      }
    );
  }

  _renderSubmitButton() {
    return (
      <div>
        <input
            type='submit'
            value='Create Instance'
            className={classnames(styles.formInput, { [styles.formSaving]: this.state.isSaving })}
            />
      </div>
    )
  }

  _renderTrackPlayer() {
    const { buffer } = this.state;

    return (
      <div>
        <div className={styles.label}>
          {/* Play button  */}
          <InstancePlaylist
            renderErrorComponent={this._renderErrorComponent}
            buffer={buffer}
            />
        </div>

        <SampleInstances />
        
      </div>
    );
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.updateTrack) {
      this._updateTrack(nextProps.stagedSample);

      this.setState({
        updateTrack: false
      })
    }
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
            type='number'
            step='0.01'
            value={startTime}
            onChange={this._handleChange.bind(this, 'startTime')}
            placeholder='startTime'
            className={styles.formInput} />
          
          <label htmlFor='volume'>volume (-infinity to +infinity)</label>
          <input id='volume'
            type='number'
            step='0.01'
            value={volume}
            onChange={this._handleChange.bind(this, 'volume')}
            placeholder='volume'
            className={styles.formInput} />
          
          <label htmlFor='panning'>panning (-1 to 1)</label>
          <input id='panning'
            type='number'
            step='0.01'
            value={panning}
            onChange={this._handleChange.bind(this, 'panning')}
            placeholder='panning'
            className={styles.formInput} />
          
          {
            this.state.buffer
              ? this._renderSubmitButton()
              : null
          }

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
  setStagedSample,
  updateTrackDimensionsWithAdditionalSample
};

function mapStateToProps(state) {
  return { 
    objectUrl: selectors.getStagedObjectUrl(state),
    stagedSample: selectors.getStagedSample(state),
    trackDimensions: selectors.getTrackDimensions(state)
  }
}

export { Staging }

export default compose(
  withStyles(styles),
  connect(mapStateToProps, mapActionsToProps)
)(Staging);
