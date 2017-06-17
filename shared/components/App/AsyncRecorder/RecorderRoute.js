import React from 'react';
import Helmet from 'react-helmet';
import ReactAudioPlayer from 'react-audio-player';
import axios from 'axios';

import Recorder from './Recorder';
import config from '../../../../config';

class RecorderRoute extends React.Component {
  constructor(props) {
    super(props);

    this.prompts = {
      START: this._renderStartRecordingPrompt.bind(this),
      STOP: this._renderStopRecordingPrompt.bind(this),
      SAVE: this._renderSaveRecordingPrompt.bind(this),
      SAVE_SUCCESS: this._renderSaveSuccessPrompt.bind(this),
      SAVE_ERROR: this._renderSaveErrorPrompt.bind(this),
    };

    this.state = {
      disableRecording: true,
      currentPrompt: this.prompts.START,
      blob: undefined,
    };

    this._startRecording = this._startRecording.bind(this);
    this._stopRecording = this._stopRecording.bind(this);
    this._changePromptToStop = this._changePromptToStop.bind(this);
    this._getSample = this._getSample.bind(this);
    this._saveRecording = this._saveRecording.bind(this);
  }

  _getSample(blob) {
    this.setState({
      currentPrompt: this.prompts.SAVE,
      blob,
    });
  }

  _changePromptToStop() {
    this.setState({ currentPrompt: this.prompts.STOP });
  }

  _startRecording() {
    this.recorder.start(this._changePromptToStop);
  }

  _stopRecording() {
    this.recorder.stop(this._getSample);
  }

  _saveRecording() {
    const data = new FormData();
    data.append('file', new File([this.state.blob], 'sample.mp3'));

    const config = {
      onUploadProgress: (progressEvent) => {
        console.log(
          `upload progress: ${Math.round(progressEvent.loaded * 100 / progressEvent.total)}`,
        );
      },
    };
    axios
      .post('/api/sample', data, config)
      .then(() => this.setState({ currentPrompt: this.prompts.SAVE_SUCCESS }))
      .catch((err) => {
        // @todo log error
        this.setState({ currentPrompt: this.prompts.SAVE_ERROR });
      });
  }

  _renderSaveErrorPrompt() {
    return <div>Ice Cream melted :(</div>;
  }

  _renderSaveSuccessPrompt() {
    return <div>Taco crunchy!</div>;
  }

  _renderSaveRecordingPrompt() {
    this._saveRecording();
    return <div> saving recording... </div>;
  }

  _renderStopRecordingPrompt() {
    return <button onClick={this._stopRecording}>Stop</button>;
  }

  _renderStartRecordingPrompt() {
    return this.state.disableRecording
      ? <div>Waiting on encoder to initialize</div>
      : <button onClick={this._startRecording}>Start</button>;
  }

  _drawBlobs() {
    return (
      <div>
        {this.state.blob
          ? <ReactAudioPlayer src={window.URL.createObjectURL(this.state.blob)} controls />
          : null}
        {this.state.backedupBlob
          ? <ReactAudioPlayer src={window.URL.createObjectURL(this.state.backedupBlob)} controls />
          : null}
      </div>
    );
  }

  componentDidMount() {
    this.body = document.querySelector('body');

    this.recorder = new Recorder({
      sampleRate: 44100,
      bitRate: 128,
      success: () => {
        this.setState({ disableRecording: false });
      },
      error: (msg) => {
        alert(msg);
      },
      fix: (msg) => {
        // @todo this.setState({ currentPrompt: this.prompts.SUPPORT_ERROR })
        console.log(msg);
      },
    });
  }

  render() {
    return (
      <div style={{ textAlign: 'center' }}>
        <Helmet>
          <title>{`${config('appTitle')} - recorder`}</title>
        </Helmet>

        {this.state.currentPrompt()}
        {this._drawBlobs()}
      </div>
    );
  }
}

export default RecorderRoute;
