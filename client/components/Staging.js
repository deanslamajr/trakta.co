import React from 'react'
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import axios from 'axios'

import styles from './staging.css'

class Staging extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      volume: -6,
      panning: .5,
      startTime: 0
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

    const data = new FormData();
    data.append('file', new File([this.props.blob], 'sample.mp3'));

    const config = {
      onUploadProgress: (progressEvent) => {
        console.log(
          `upload progress: ${Math.round(progressEvent.loaded * 100 / progressEvent.total)}`,
        );
      },
    };

    axios
      .post(`/api/sample?startTime=${this.state.startTime}&duration=${this.props.duration}&volume=${this.state.volume}&panning=${this.state.panning}`, data, config)
      .then(() => this.props.showMainMenu())
      .catch((err) => {
        // @todo log error
        console.error(err);
        // this.props.failureCB
      });
  }

  render () {
    return (
      <form className={styles.container} onSubmit={this._saveRecording}>
        <label htmlFor='startTime'>startTime</label>
        <input id='startTime' type='number' value={this.state.startTime} onChange={this.handleChange.bind(this, 'startTime')} placeholder='startTime' className={styles.formInput} />
        <label htmlFor='volume'>volume</label>
        <input id='volume' type='number' value={this.state.volume} onChange={this.handleChange.bind(this, 'volume')} placeholder='volume' className={styles.formInput} />
        <label htmlFor='panning'>panning</label>
        <input id='panning' type='number' value={this.state.panning} onChange={this.handleChange.bind(this, 'panning')} placeholder='panning' className={styles.formInput} />
        <input type='submit' value='Create Instance' className={styles.formInput} />
      </form>
    )
  }
}

export default withStyles(styles)(Staging)
