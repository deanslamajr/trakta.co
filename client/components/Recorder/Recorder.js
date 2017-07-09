import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import viewportDimensions from 'viewport-dimensions';
import Tone from 'tone';
import lamejs from 'lamejs';
import ReactAudioPlayer from 'react-audio-player';
import axios from 'axios';
import WaveformData from 'waveform-data';

import styles from './Recorder.css'

const resolution = 256;

let dataBuffer;
let audioBuffers;

let mp3Encoder;

function inititializeEncoder(sampleRate) {
  mp3Encoder = new lamejs.Mp3Encoder(1, sampleRate, 128);
  clearBuffers();
}

function clearBuffers() {
  dataBuffer = [];
  audioBuffers = [];
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

function generateMp3Blob() {
  appendToBuffer(mp3Encoder.flush());
  return new Blob(dataBuffer, { type: 'audio/mp3' });
}

function appendToBuffer(mp3Buf) {
  dataBuffer.push(new Int8Array(mp3Buf));
}

function convertBuffer(arrayBuffer) {
  // need to clone the incoming buffer otherwise we end up with 
  // samples reflecting the sound coming from the microphone at the instant we stopped recording
  const data = new Float32Array(arrayBuffer);
  const output = new Int16Array(data.length);
  
  floatTo16BitPCM(data, output);
  return output;
}

function floatTo16BitPCM(input, output) {
  for (let i = 0; i < input.length; i++) {
    const s = Math.max(-1, Math.min(1, input[i]));
    // magic bit shuffling
    output[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }
}

/**
 * Creates a new Uint8Array based on two different ArrayBuffers
 *
 * @param {ArrayBuffer} buffer1 The first buffer.
 * @param {ArrayBuffer} buffer2 The second buffer.
 * @return {ArrayBuffer} The new ArrayBuffer created out of the two.
 */
function appendBuffer(buffer1, buffer2) {
  var tmp = new Uint8Array(buffer1.byteLength + buffer2.byteLength);
  tmp.set(new Uint8Array(buffer1), 0);
  tmp.set(new Uint8Array(buffer2), buffer1.byteLength);
  return tmp.buffer;
};


class Recorder extends React.Component {
  constructor(props) {
    super(props);

    this.prompts = {
      START: this._renderInitializingRecorderPrompt.bind(this),
      STOP: this._renderStopRecordingPrompt.bind(this),
      FINISHED: this._renderFinishedRecordingPrompt.bind(this),
      SAVE_PENDING: this._renderSaveRecordingPrompt.bind(this),
      SAVE_SUCCESS: this._renderSaveSuccessPrompt.bind(this),
      SAVE_ERROR: this._renderSaveErrorPrompt.bind(this),
      USER_MEDIA_DENIED: this._renderUserMediaDenied.bind(this)
    };

    this.state = {
      isRecording: false,
      disableRecording: true,
      currentPrompt: this.prompts.START,
      userMediaSupported: Tone.UserMedia.supported,
      drawWave: false,
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
    this._drawSample = this._drawSample.bind(this);
    this._combineBuffers = this._combineBuffers.bind(this);
    this._clickedRetry = this._clickedRetry.bind(this);
  }

  _renderUserMediaDenied() {
      return (
        <div>Welp, you blew it!</div>
      );
  }

  _openRecorderAndBeginDrawingWaves() {
    this.canvasContext = this.canvas.getContext('2d'); 

    // @todo have these resize with window resize
    this.canvasContext.canvas.width = this.canvas.width;
    this.canvasContext.canvas.height = this.canvas.height;

    // draw waves
    this.setState({ drawWave: true })

    this._drawWave();
  }

  _drawWave() {
    const canvasWidth = this.canvasContext.canvas.width;
    const canvasHeight = this.canvasContext.canvas.height;

    let x;
    let y;
    let isWhite = false;

    if (this.state.drawWave) {
      requestAnimationFrame(this._drawWave);
    }

    // draw the waveform
    const values = this.analyser.analyse();

    this.canvasContext.beginPath();
    this.canvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
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
          this.canvasContext.closePath();
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
    this.canvasContext.closePath();
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
        <div className={styles.label}>
          tap to BEGIN recording
        </div>
      </div>
    );
  }

  _renderStopRecordingPrompt() {
    return (
      <div className={styles.redMask} onClick={this._stopRecording}>
        <div className={styles.label}>
          tap to END recording
        </div>
      </div>
    );
  }

  _combineBuffers() {
    let combinedArrayBuffer = audioBuffers[0];
    for(let i = 1; i < audioBuffers.length; i++) {
      combinedArrayBuffer = appendBuffer(combinedArrayBuffer, audioBuffers[i])
    }
    return combinedArrayBuffer;
  }

  _clickedRetry() {
    clearBuffers();

    this.setState(
      { 
        currentPrompt: this.prompts.START,
        drawWave: true 
      }, 
      () => this._drawWave())
  }

  _renderFinishedRecordingPrompt() {
    return (
      <div className={styles.label}>
        <div className={styles.subsetSelector}>Selector</div>
        <div className={styles.playButton}>
          { this._drawBlobs() }
        </div>
        <div className={styles.retryButton} onClick={this._clickedRetry} >Retry</div>
        <div className={styles.saveButton}>Save</div>
      </div>
    );
  }

  _drawSample(buffer) {
    const waveFormData = WaveformData.create(buffer);
    waveFormData.offset(0, buffer.byteLength/4);


    const ctx = this.canvasContext;

    const canvasWidth = ctx.canvas.width;
    const canvasHeight = ctx.canvas.height;




    const interpolateHeight = (total_height) => {
      const amplitude = 256;
      return (size) => total_height - ((size + 128) * total_height) / amplitude;
    };
    const y = interpolateHeight(canvasHeight);





    // ctx.beginPath();
    // ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    // ctx.closePath();
    
    // ctx.lineJoin = 'round';
    // ctx.lineWidth = 2;
    // ctx.strokeStyle = 'white';

    // // from 0 to 100 
    // ctx.beginPath();
    // ctx.moveTo(0, canvasHeight/2);
    // waveFormData.min.forEach((val, x) => ctx.lineTo(x + 0.5, y(val) + 0.5));
    // ctx.stroke();
    // ctx.closePath();

    // // then looping back from 100 to 0
    // ctx.beginPath();
    // ctx.moveTo(canvasWidth, canvasHeight/2);
    // waveFormData.max.reverse().forEach((val, x) => {
    //   ctx.lineTo((waveFormData.offset_length - x) + 0.5, y(val) + 0.5);
    // });
    // ctx.stroke();
    // ctx.closePath();

    ctx.beginPath();

    // from 0 to 100
    waveFormData.min.forEach((val, x) => ctx.lineTo(x + 0.5, y(val) + 0.5));

    // then looping back from 100 to 0
    waveFormData.max.reverse().forEach((val, x) => {
      ctx.lineTo((waveFormData.offset_length - x) + 0.5, y(val) + 0.5);
    });

    ctx.closePath();
    ctx.stroke();
    //this.canvas.fillStroke();


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

      this.setState({ currentPrompt: this.prompts.STOP });
    }
    else {
      // @todo log and metric
      console.error('this.processor has not been initialized!');
    }
  }

  _stopRecording() {
    this.setState({ 
      currentPrompt: this.prompts.FINISHED,
      isRecording: false,
      drawWave: false
    });

    // recorder cleanup
    this.processor.disconnect();
    
    // combine audioBuffers
    const summedBuffer = this._combineBuffers();
    
    // draw wave
    const curriedDrawSample = this._drawSample.bind(this, summedBuffer);
    requestAnimationFrame(curriedDrawSample);

    // encode mp3
    encode(summedBuffer, this.bufferSize); 
    const blob = generateMp3Blob();

    this.setState({ 
      blob 
    });
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
        this.bufferSize = this.processor.bufferSize;

        this.processor.onaudioprocess = (event) => {
          const float32Array = event.inputBuffer.getChannelData(0); 
          const arrayBuffer = float32Array.buffer.slice();

          audioBuffers.push(arrayBuffer);
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
        this.setState({ currentPrompt: this.prompts.USER_MEDIA_DENIED });
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