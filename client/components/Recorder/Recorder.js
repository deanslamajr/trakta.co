import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import viewportDimensions from 'viewport-dimensions';
import Tone from 'tone';
import lamejs from 'lamejs';
import ReactAudioPlayer from 'react-audio-player';
import axios from 'axios';

import styles from './Recorder.css'

const resolution = 256;

let dataBuffer;
let mp3Encoder;

function inititializeEncoder(sampleRate) {
  mp3Encoder = new lamejs.Mp3Encoder(1, sampleRate, 128);
  clearBuffer();
}

function clearBuffer() {
  dataBuffer = [];
}

function encode(arrayBuffer, bufferSize) {
  const samplesMono = convertBuffer(arrayBuffer);
  let remaining = samplesMono.length;
  for (let i = 0; remaining >= 0; i += bufferSize) {
    const left = samplesMono.subarray(i, i + bufferSize);
    const mp3buf = mp3Encoder.encodeBuffer(left);
    appendToBuffer(mp3buf);
    remaining -= bufferSize;
  }
}

function appendToBuffer(mp3Buf) {
  dataBuffer.push(new Int8Array(mp3Buf));
}

function convertBuffer(arrayBuffer) {
  // need to clone the incoming buffer otherwise we end up with 
  // samples reflecting the sound coming from the microphone at the instant we stopped recording
  const data = new Float32Array(arrayBuffer);
  const output = new Int16Array(arrayBuffer.length);
  floatTo16BitPCM(data, output);
  return output;
}

function floatTo16BitPCM(input, output) {
  for (let i = 0; i < input.length; i++) {
    const s = Math.max(-1, Math.min(1, input[i]));
    output[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }
}

function finishRecording() {
  appendToBuffer(mp3Encoder.flush());
  return new Blob(dataBuffer, { type: 'audio/mp3' });
}



class Recorder extends React.Component {
  constructor(props) {
    super(props);

    this.prompts = {
      START: this._renderInitializingRecorderPrompt.bind(this),
      STOP: this._renderStopRecordingPrompt.bind(this),
      SAVE_PENDING: this._renderSaveRecordingPrompt.bind(this),
      SAVE_SUCCESS: this._renderSaveSuccessPrompt.bind(this),
      SAVE_ERROR: this._renderSaveErrorPrompt.bind(this),
    };

    this.state = {
      isRecording: false,
      disableRecording: true,
      currentPrompt: this.prompts.START,
      userMediaSupported: Tone.UserMedia.supported,
      // @todo remove
      blob: undefined
    };

    if (Tone.UserMedia.supported) {
      this.userMedia = new Tone.UserMedia();

      this.analyser = new Tone.Analyser({
        type : 'waveform',
        size : resolution
      });

      this.userMedia.connect(this.analyser);
    }

    this._renderUserMediaSupported = this._renderUserMediaSupported.bind(this);
    this._renderStartRecordingPrompt = this._renderStartRecordingPrompt.bind(this);
    this._startRecording = this._startRecording.bind(this);
    this._stopRecording = this._stopRecording.bind(this);
    this._drawBlobs = this._drawBlobs.bind(this);
    this._openRecorderAndBeginDrawingWaves = this._openRecorderAndBeginDrawingWaves.bind(this);
    this._drawWave = this._drawWave.bind(this);
    this._renderUserMediaNotSupported = this._renderUserMediaNotSupported.bind(this);
    this._saveRecording = this._saveRecording.bind(this);
  }

  _openRecorderAndBeginDrawingWaves() {
    this.canvasContext = this.canvas.getContext('2d');

    // @todo have these resize with window resize
    this.canvasContext.canvas.width = this.canvas.width;
    this.canvasContext.canvas.height = this.canvas.height;

    this._drawWave();
  }

  _drawWave() {
    const canvasWidth = this.canvasContext.canvas.width;
    const canvasHeight = this.canvasContext.canvas.height;

    let x;
    let y;
    let isWhite = false;

    // @todo do we need to be able to clean this up? or will we beable to do a redirect to another page to clear this work?
    requestAnimationFrame(this._drawWave);

    // draw the waveform
    const values = this.analyser.analyse();

    this.canvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
    this.canvasContext.beginPath();
    this.canvasContext.lineJoin = 'round';
    if(this.state.isRecording) {
      this.canvasContext.lineWidth = 5;
      this.canvasContext.strokeStyle = 'red';
    }
    else {
      this.canvasContext.lineWidth = 2;
      this.canvasContext.strokeStyle = '#CCCCCC';
    }
    this.canvasContext.moveTo((values[0] / 255) * canvasWidth, canvasHeight);

    const now = Date.now();
    
    for (let i = values.length; i > 0; i--){
      if(this.state.isRecording) {
        if ((1-i/values.length) > ((now - this.state.recordingStartTime)/10000) && !isWhite) {
          isWhite = true;
          this.canvasContext.stroke();
          this.canvasContext.lineWidth = 2;
          this.canvasContext.strokeStyle = '#CCCCCC';
          this.canvasContext.beginPath();
          this.canvasContext.moveTo(x, y);
          this.canvasContext.lineJoin = 'round';
        }
      }
      const val = values[i] / (resolution - 1);
      x = val * canvasWidth;
      y = (i / (resolution - 1)) * canvasHeight;
      this.canvasContext.lineTo(x, y);
    }

    this.canvasContext.stroke();
  }

  _renderInitializingRecorderPrompt() {
    return (
      <div>
        {
          this.state.disableRecording
            ? <div>Waiting on encoder to initialize</div>
            : this._renderStartRecordingPrompt()
        }
      </div>
    );
  }

  _renderStartRecordingPrompt() {
    return (
      <div className={styles.blueMask} onClick={this._startRecording} >
        Start
      </div>
    );
  }

  _renderStopRecordingPrompt() {
    return (
      <div className={styles.redMask} onClick={this._stopRecording}>
        Stop
      </div>
    );
  }

  _renderSaveRecordingPrompt() {
    this._saveRecording();
    return <div> saving recording... </div>;
  }

  _renderSaveErrorPrompt() {
    return <div>Ice Cream melted :(</div>;
  }

  _renderSaveSuccessPrompt() {
    return <div>Taco crunchy!</div>;
  }

  _renderUserMediaSupported() {
    // "- 5" to keep canvas within viewport i.e. no scrollbars
    const width = viewportDimensions 
      ? viewportDimensions.width() && viewportDimensions.width() - 5
      : 300;
    const height = viewportDimensions
      ? viewportDimensions.height() && viewportDimensions.height() - 5
      : 300;

    return (
      <div>
        {this.state.currentPrompt()}
        { /* @todo remove this */ this._drawBlobs()}
        <canvas 
          className={styles.container}
          width={width} 
          height={height}
          ref={(canvas) => { this.canvas = canvas; }}
        />
      </div>
    );
  }

  _drawBlobs() {
    return (
      <div>
        {
          this.state.blob
            ? <ReactAudioPlayer src={window.URL.createObjectURL(this.state.blob)} controls />
            : null
        }
      </div>
    );
  }

  _renderUserMediaNotSupported() {
    return (
      // @todo replace with imported css
      <div className={styles.notSupportedMessage}>
        WebAudio is not supported by this browser.
        <br/>
        Please upgrade this browser's version or switch to a browser that supports this technology.
        <br/>
        i.e. internet explorer, safari, and all iOS-based browsers will not be able to run this application
      </div>
    );
  }

  _startRecording() {
    if (this.processor) {
      this.userMedia.connect(this.processor);
      // if the ScriptProcessorNode is not connected to an output the "onaudioprocess" event is not triggered in chrome
      this.processor.connect(this.context.destination);

      this.setState({ 
        recordingStartTime: Date.now(),
        isRecording: true 
      });
    }
    else {
      // @todo log and metric
      console.error('this.processor has not been initialized!');
    }

    this.setState({ currentPrompt: this.prompts.STOP });
  }

  _stopRecording() {
    if (this.processor) {
      this.processor.disconnect();
      console.log('Recorder has stopped recording');
      const blob = finishRecording();
      this.setState({ 
        currentPrompt: this.prompts.SAVE_PENDING,
        blob });
    } 
    else {
      console.log('Error trying to stop recorder');
    }
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

  componentDidMount() {
    // opening the input asks the user to activate their mic
    this.userMedia.open()
      .then(() => {
        // save a reference to the AudioContext
        this.context = this.userMedia.context._context;

        inititializeEncoder(this.context.sampleRate)

        // a bufferSize of 0 instructs the browser to choose the best bufferSize
        this.processor = this.context.createScriptProcessor(0, 1, 1);
        const bufferSize = this.processor.bufferSize;

        this.processor.onaudioprocess = (event) => {
          const arrayBuffer = event.inputBuffer.getChannelData(0);
          // @todo move to webworker
          encode(arrayBuffer, bufferSize);
        };

        // @todo tweak this for best performance
        // @see{https://tonejs.github.io/docs/#Context}
        // this.userMedia.context.latencyHint = 'balanced';
        
        // overlay 'start recording' mask
        this.setState({ disableRecording: false });
        this._openRecorderAndBeginDrawingWaves();
      })
      .catch(err => {
        console.error(err);
        // @todo log and metric
        // @todo show user a userful view
        alert('user rejected userMedia request!');
      });
  }

  render() {
    return (
      // @todo replace with imported css
      <div>
        { 
          this.state.userMediaSupported 
            ? this._renderUserMediaSupported() 
            : this._renderUserMediaNotSupported() 
        }
      </div>
    );
  }
}

export default withStyles(styles)(Recorder)