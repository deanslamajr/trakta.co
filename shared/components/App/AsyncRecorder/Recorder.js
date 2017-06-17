import lamejs from 'iso-lamejs';

const maxSamples = 1152;
let mp3Encoder;
let dataBuffer;

function floatTo16BitPCM(input, output) {
  for (let i = 0; i < input.length; i++) {
    const s = Math.max(-1, Math.min(1, input[i]));
    output[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }
}

function clearBuffer() {
  dataBuffer = [];
}

function initEncoder(prefConfig) {
  const encoderConfig = prefConfig || {};
  mp3Encoder = new lamejs.Mp3Encoder(
    1,
    encoderConfig.sampleRate || 44100,
    encoderConfig.bitRate || 80,
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

function convertBuffer(arrayBuffer) {
  const data = new Float32Array(arrayBuffer);
  const output = new Int16Array(arrayBuffer.length);
  floatTo16BitPCM(data, output);
  return output;
}

function appendToBuffer(mp3Buf) {
  dataBuffer.push(new Int8Array(mp3Buf));
}

function finishRecording() {
  appendToBuffer(mp3Encoder.flush());
  return new Blob(dataBuffer, { type: 'audio/mp3' });
}

function Recorder(recorderConfig = {}) {
  const _this = this;
  // recorderConfig.sampleRate = recorderConfig.sampleRate || 44100;
  // bitrate 80 ~= filesize 10kb/sec
  recorderConfig.bitRate = recorderConfig.bitRate || 80;

  init();

  if (navigator.getUserMedia && window.AudioContext) {
    // @see{https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia#Parameters}
    navigator.getUserMedia(
      // we want the audio, not the video
      { audio: true },
      (stream) => {
        const context = new window.AudioContext();
        // Set up Web Audio API to process data from the media stream (microphone).
        const microphone = context.createMediaStreamSource(stream);
        // a bufferSize of 0 instructs the browser to choose the best bufferSize
        const processor = context.createScriptProcessor(0, 1, 1);

        // set sample rate same as that of the native context
        recorderConfig.sampleRate = context.sampleRate;

        processor.onaudioprocess = (event) => {
          const array = event.inputBuffer.getChannelData(0);
          // @todo move to webworker
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
            console.log('Recorder has stopped recording');
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
        // @todo throw/handle error
        console.log(msg);
        if (recorderConfig.error) {
          recorderConfig.error(msg);
        }
      },
    );
  } else {
    // @todo throw/handle error
    const msg = 'navigator.getUserMedia not supported';
    console.log(msg);
    if (recorderConfig.fix) {
      recorderConfig.fix(msg);
    }
  }
}

export default Recorder;
