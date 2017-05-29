import React from 'react';
import Helmet from 'react-helmet';
import lamejs from 'lamejs';
import ReactAudioPlayer from 'react-audio-player';

import config from '../../../../config';

const maxSamples = 1152;
let encoderConfig;
let mp3Encoder;
let dataBuffer;

function clearBuffer() {
  dataBuffer = [];
}

function initEncoder(prefConfig) {
  encoderConfig = prefConfig || {};
  mp3Encoder = new lamejs.Mp3Encoder(
    1,
    encoderConfig.sampleRate || 44100,
    encoderConfig.bitRate || 128,
  );
  clearBuffer();
  console.log('encoder has been initialized');
  // @todo enable the record button at this time
  encoderConfig.success();
}

function init() {
  // @todo update this to support all versions of this syntax
  // @see{https://developer.mozilla.org/en-US/docs/Web/API/Navigator/getUserMedia#Browser_compatibility}
  navigator.getUserMedia =
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia;

  window.AudioContext = window.AudioContext || window.webkitAudioContext;
}

function floatTo16BitPCM(input, output) {
  for (let i = 0; i < input.length; i++) {
    const s = Math.max(-1, Math.min(1, input[i]));
    output[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }
}

function convertBuffer(arrayBuffer) {
  const data = new Float32Array(arrayBuffer);
  const output = new Int16Array(arrayBuffer.length);
  floatTo16BitPCM(data, output);
  return output;
}

function appendToBuffer(mp3Buf) {
  dataBuffer.push(new Int8Array(mp3Buf));
}

function encode(arrayBuffer) {
  const samplesMono = convertBuffer(arrayBuffer);
  let remaining = samplesMono.length;
  for (let i = 0; remaining >= 0; i += maxSamples) {
    const left = samplesMono.subarray(i, i + maxSamples);
    const mp3buf = mp3Encoder.encodeBuffer(left);
    appendToBuffer(mp3buf);
    remaining -= maxSamples;
  }
}

function finishRecording() {
  appendToBuffer(mp3Encoder.flush());
  return new Blob(dataBuffer, { type: 'audio/mp3' });
}

function Recorder(preferredConfig) {
  const _this = this;
  const recorderConfig = preferredConfig || {};
  recorderConfig.sampleRate = recorderConfig.sampleRate || 44100;
  // bitrate 80 ~= filesize 10kb/sec
  recorderConfig.bitRate = recorderConfig.bitRate || 80;

  init();

  if (navigator.getUserMedia && window.AudioContext) {
    // @see{https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia#Parameters}
    navigator.getUserMedia(
      { audio: true },
      (stream) => {
        const context = new window.AudioContext();
        // Set up Web Audio API to process data from the media stream (microphone).
        const microphone = context.createMediaStreamSource(stream);
        // Settings a bufferSize of 0 instructs the browser to choose the best bufferSize
        const processor = context.createScriptProcessor(0, 1, 1);
        let successCallback;
        let errorCallback;

        recorderConfig.sampleRate = context.sampleRate;

        processor.onaudioprocess = (event) => {
          console.log('audioprocess event!');
          const array = event.inputBuffer.getChannelData(0);
          encode(array);
        };

        _this.start = (successCB) => {
          if (processor && microphone) {
            microphone.connect(processor);
            processor.connect(context.destination);
            console.log('Recorder has started recording');
            successCB();
          } else {
            console.log('Error trying to start recorder');
          }
        };

        _this.stop = (successCB) => {
          if (processor && microphone) {
            microphone.disconnect();
            processor.disconnect();
            console.log('Recording has stopped');
            const blob = finishRecording();
            successCB(blob);
          } else {
            console.log('Error trying to stop recorder');
          }
        };

        initEncoder({
          sampleRate: recorderConfig.sampleRate,
          bitRate: recorderConfig.bitRate,
          success: recorderConfig.success,
        });
      },
      (error) => {
        var msg;
        switch (error.code || error.name) {
          case 'PermissionDeniedError':
          case 'PERMISSION_DENIED':
          case 'NotAllowedError':
            msg = 'Permissions error';
            break;
          case 'NOT_SUPPORTED_ERROR':
          case 'NotSupportedError':
            msg = 'Not supported error';
            break;
          case 'MANDATORY_UNSATISFIED_ERROR':
          case 'MandatoryUnsatisfiedError':
            msg = 'MandatoryUnsatisfiedError';
            break;
          default:
            msg = `error:${error.code || error.name}`;
            break;
        }
        console.error(msg);
        if (recorderConfig.error) {
          recorderConfig.error(msg);
        }
      },
    );
  } else {
    // @todo throw/handle error
    const msg = 'navigator.getUserMedia not supported';
    console.log(msg);
    if (config.fix) {
      config.fix(msg);
    }
  }
}

class RecorderRoute extends React.Component {
  constructor(props) {
    super(props);

    this.prompts = {
      START: this._renderStartRecordingPrompt.bind(this),
      STOP: this._renderStopRecordingPrompt.bind(this),
    };

    this.state = {
      currentPrompt: this.prompts.START,
      // @todo temporary property, remove eventually
      blobs: [],
    };

    this._startRecording = this._startRecording.bind(this);
    this._stopRecording = this._stopRecording.bind(this);
    this._changePromptToStop = this._changePromptToStop.bind(this);
    this._drawSample = this._drawSample.bind(this);
  }

  _drawSample(blob) {
    console.log(blob);
    // const audio = document.createElement('audio');
    const blobs = this.state.blobs.slice();
    console.log(`blob url:${window.URL.createObjectURL(blob)}`);
    blobs.push(window.URL.createObjectURL(blob));
    this.setState({ blobs });
    // audio.src = ;
    // audio.controls = true;
    // this.body.appendChild(audio);
  }

  _changePromptToStop() {
    this.setState({ currentPrompt: this.prompts.STOP });
  }

  _startRecording() {
    console.log('_startRecording has been invoked');
    this.recorder.start(this._changePromptToStop);
  }

  _stopRecording() {
    console.log('_stopRecording has been invoked');
    this.recorder.stop(this._drawSample);
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
    return this.state.blobs.map((blob, index) => {
      console.log('inside _drawBlobs');
      return (
        <ReactAudioPlayer
          key={index}
          src={blob}
          ref={(element) => {
            console.dir(element);
          }}
          controls
        />
      );
    });
  }

  componentDidMount() {
    this.body = document.querySelector('body');

    this.recorder = new Recorder({
      sampleRate: 44100,
      bitRate: 80,
      success: () => {
        console.log('invoked the successcallback defined in componentDidMount');
        this.setState({ disableRecording: false });
      },
      error: (msg) => {
        alert(msg);
      },
      fix: (msg) => {
        alert(msg);
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
