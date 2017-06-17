import React from 'react';
import Helmet from 'react-helmet';
// import ReactAudioPlayer from 'react-audio-player';
// import axios from 'axios';

import Recorder from '../../../../client/components/Recorder';

import config from '../../../../config';

class RecorderRoute extends React.Component {
  constructor(props) {
    super(props);

    // this.prompts = {
    //   STOP: this._renderStopRecordingPrompt.bind(this),
    //   SAVE: this._renderSaveRecordingPrompt.bind(this),
    //   SAVE_SUCCESS: this._renderSaveSuccessPrompt.bind(this),
    //   SAVE_ERROR: this._renderSaveErrorPrompt.bind(this),
    // };

    this.state = {
      isClient: false
    };

    // this._stopRecording = this._stopRecording.bind(this);
    // this._changePromptToStop = this._changePromptToStop.bind(this);
    // this._getSample = this._getSample.bind(this);
    // this._saveRecording = this._saveRecording.bind(this);
  }

  // _getSample(blob) {
  //   this.setState({
  //     currentPrompt: this.prompts.SAVE,
  //     blob,
  //   });
  // }

  // _changePromptToStop() {
  //   this.setState({ currentPrompt: this.prompts.STOP });
  // }

  // _startRecording() {
  //   this.recorder.start(this._changePromptToStop);
  // }

  // _stopRecording() {
  //   this.recorder.stop(this._getSample);
  // }

  // _saveRecording() {
  //   const data = new FormData();
  //   data.append('file', new File([this.state.blob], 'sample.mp3'));

  //   const config = {
  //     onUploadProgress: (progressEvent) => {
  //       console.log(
  //         `upload progress: ${Math.round(progressEvent.loaded * 100 / progressEvent.total)}`,
  //       );
  //     },
  //   };
  //   axios
  //     .post('/api/sample', data, config)
  //     .then(() => this.setState({ currentPrompt: this.prompts.SAVE_SUCCESS }))
  //     .catch((err) => {
  //       // @todo log error
  //       this.setState({ currentPrompt: this.prompts.SAVE_ERROR });
  //     });
  // }

  // _renderSaveErrorPrompt() {
  //   return <div>Ice Cream melted :(</div>;
  // }

  // _renderSaveSuccessPrompt() {
  //   return <div>Taco crunchy!</div>;
  // }

  // _renderSaveRecordingPrompt() {
  //   this._saveRecording();
  //   return <div> saving recording... </div>;
  // }

  // _renderStopRecordingPrompt() {
  //   return <button onClick={this._stopRecording}>Stop</button>;
  // }



  _renderLoading() {
    return (
      // @todo replace with imported css
      <div style={{ color: 'white', fontSize: '20px' }}>
        !Loading!
      </div>
    );
  }

  componentDidMount() {
    this.setState({ isClient: true });
  }

  render() {
    return (
      // @todo replace with imported css
      <div style={{ textAlign: 'center' }}>
        <Helmet>
          <title>{`recorder - ${config('appTitle')}`}</title>
        </Helmet>
        { 
          this.state.isClient 
            ? <Recorder /> 
            : this._renderLoading()
        }
      </div>
    );
  }
}

export default RecorderRoute;
