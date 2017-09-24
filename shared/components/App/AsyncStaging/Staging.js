import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import axios from 'axios';
import classnames from 'classnames';

import InstancePlaylist from '../../../../client/components/InstancePlaylist';
import SampleInstances from '../../../../client/components/SampleInstances';

import styles from './staging.css'

const windowLength = 20;
const windowStartTime = 0;

class Staging extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      volume: 0,
      panning: 0,
      startTime: 0,
      isSaving: false,
      windowLength,
      windowStartTime
    }

    this._saveRecording = this._saveRecording.bind(this)
  }

  handleChange (type, event) {
    const parsedValue = parseFloat(event.target.value);
    this.setState({ [type]: parsedValue })
  }

  _saveRecording(event) {
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

    axios
      .post(`/api/sample?startTime=${this.state.startTime}&duration=${this.props.duration}&volume=${this.state.volume}&panning=${this.state.panning}`, data, config)
      .then(() => this.props.history.push('/staging'))
      .catch((err) => {
        // @todo log error
        console.error(err);
        // this.props.failureCB
      });
  }

  _renderErrorComponent(clickHandler) {
    return (
      <div onClick={clickHandler} className={classnames()}>
        <div className={classnames(styles.icon)}>&#9888;</div>
      </div>
    );
  }

  componentWillMount() {
    console.log('componentWillMount()');
  }

  componentDidMount() {
    console.log('componentDidMount()')
  }

  render () {
    const {
      windowLength,
      windowStartTime
    } = this.state;

    return (
      <div>
        <form className={styles.container} onSubmit={this._saveRecording}>
          <label htmlFor='startTime'>startTime</label>
          <input id='startTime' type='number' value={this.state.startTime} onChange={this.handleChange.bind(this, 'startTime')} placeholder='startTime' className={styles.formInput} />
          <label htmlFor='volume'>volume (-infinity to 0)</label>
          <input id='volume' type='number' value={this.state.volume} onChange={this.handleChange.bind(this, 'volume')} placeholder='volume' className={styles.formInput} />
          <label htmlFor='panning'>panning (-1 to 1)</label>
          <input id='panning' type='number' value={this.state.panning} onChange={this.handleChange.bind(this, 'panning')} placeholder='panning' className={styles.formInput} />
          <input type='submit' value='Create Instance' className={classnames(styles.formInput, { [styles.formSaving]: this.state.isSaving })} />
          <div className={classnames({ [styles.loadSpinner]: this.state.isSaving })} /> 
        </form>

         <div className={styles.label}>
          {/* Play button  */}
          {/* @todo  */}
          <InstancePlaylist
            renderErrorComponent={this._renderErrorComponent}
            windowLength={windowLength} 
            windowStartTime={windowStartTime} />
        </div>

        <SampleInstances 
          windowLength={windowLength} 
          windowStartTime={windowStartTime}/> 
      </div>
    )
  }
}

export default withStyles(styles)(Staging)
