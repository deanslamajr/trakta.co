import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import ReactAudioPlayer from 'react-audio-player';

import * as selectors from '../../../shared/reducers';
import { setStagedObjectUrl } from '../../../shared/actions/recorder';

import { getSampleCreator } from '../Recorder/SampleCreator';

import styles from './cleanup.css'

function getRootPath (fullPath) {
  const pathTokens = fullPath.split('/');
  return pathTokens[1] || ''
}

class Cleanup extends React.Component {
  constructor (props) {
    super(props);

    try {
      this.sampleCreator = getSampleCreator();
    }
    catch(error) {
      // Tone.UserMedia is not supported
      // @todo catch this earlier
    }

    this.state = {
      clipStart: 0,
      clipEnd: this.sampleCreator.getDataBufferLength()
    }

    this._clickedRetry = this._clickedRetry.bind(this);
    this._clickUseThisSelection = this._clickUseThisSelection.bind(this);
  }

  _clickedRetry () {
    const rootPath = getRootPath(this.props.match.path);

    this.props.history.goBack();
  }

  _clickUseThisSelection () {
    const rootPath = getRootPath(this.props.match.path);

    this.props.history.push(`/${rootPath}/staging`);
  }
  
  _handleChange (type, event) {
    const parsedValue = parseFloat(event.target.value);
    this.setState({ [type]: parsedValue })
  }

  _renderClippingInputs () {
    const maxClipValue = this.sampleCreator.getDataBufferLength()

    return (
      <div>
        (min: 0, max: {maxClipValue})

        <label htmlFor='start'>start position</label>
        <input id='start'
          type='number'
          step='0.01'
          value={this.state.clipStart}
          onChange={this._handleChange.bind(this, 'clipStart')}
          className={styles.formInput} />

        <label htmlFor='end'>end position</label>
        <input id='end'
          type='number'
          step='0.01'
          value={this.state.clipEnd}
          onChange={this._handleChange.bind(this, 'clipEnd')}
          className={styles.formInput} />
      </div>
    )
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.state.clipStart != nextState.clipStart || this.state.clipEnd != nextState.clipEnd) {
      this.sampleCreator.createBlob(nextState.clipStart, nextState.clipEnd)

      const objectUrl = this.sampleCreator.createBlobObjectUrl();

      this.props.setStagedObjectUrl(objectUrl);
    }
  }

  render() {
    return (
      <div>
        <div className={styles.label}>
          <div className={styles.retryButton} onClick={this._clickedRetry}>Try another recording</div>
          {
            this.props.objectUrl && 
            (
              <div>
                <div className={styles.playButton}>
                  <ReactAudioPlayer src={this.props.objectUrl} controls />
                </div>
                {this._renderClippingInputs()}
                <div className={styles.saveButton} onClick={this._clickUseThisSelection}>Use this selection</div>
              </div>
            )
          }
        </div>
      </div>
    )
  }
}

const mapActionsToProps = {
  setStagedObjectUrl
};

function mapStateToProps(state) {
  return { objectUrl: selectors.getStagedObjectUrl(state) }
}

export default compose(
  withStyles(styles),
  connect(mapStateToProps, mapActionsToProps)
)(Cleanup);