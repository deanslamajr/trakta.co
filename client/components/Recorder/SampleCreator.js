import Tone from 'tone';
import lamejs from 'lamejs';

/**
 * Private
 */
let userMedia;
let analyser;
let mp3Encoder;
let dataBuffer;
let audioBuffers;
let processor;
let bufferSize;
let blob;

function inititializeEncoder (sampleRate) {
  mp3Encoder = new lamejs.Mp3Encoder(1, sampleRate, 128);
  clearBuffers();
}

function clearBuffers () {
  dataBuffer = [];
  audioBuffers = [];
}

function processAudioEvent (event) {
  const float32Array = event.inputBuffer.getChannelData(0); 
  const arrayBuffer = float32Array.buffer.slice();

  audioBuffers.push(arrayBuffer);
}

function combineBuffers() {
  let combinedArrayBuffer = audioBuffers[0];
  for (let i = 1; i < audioBuffers.length; i++) {
    combinedArrayBuffer = appendBuffer(combinedArrayBuffer, audioBuffers[i])
  }
  return combinedArrayBuffer;
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

function appendToBuffer(mp3Buf) {
  dataBuffer.push(new Int8Array(mp3Buf));
}

function generateMp3Blob() {
  appendToBuffer(mp3Encoder.flush());
  return new Blob(dataBuffer, { type: 'audio/mp3' });
}

/**
 * Public
 */
export default class SampleCreator {
  constructor () {
    this.resolution = 256;

    if (Tone.UserMedia.supported) {
      userMedia = new Tone.UserMedia();

      analyser = new Tone.Analyser({
        type : 'waveform',
        size : this.resolution
      });

      userMedia.connect(analyser);
    }
    else {
      throw new Error('Tone.UserMedia is not supported')
    }
  }

  openMic () {
    return userMedia.open() // opening the input asks the user to activate their mic
      .then(() => {
        // save a reference to the AudioContext
        const context = userMedia.context._context;

        inititializeEncoder(context.sampleRate)

        // a bufferSize of 0 instructs the browser to choose the best bufferSize
        processor = context.createScriptProcessor(0, 1, 1);
        bufferSize = processor.bufferSize;

        processor.onaudioprocess = processAudioEvent;

        // @todo tweak this for best performance
        // @see{https://tonejs.github.io/docs/#Context}
        // userMedia.context.latencyHint = 'balanced';
      });
  }

  startRecording () {
    userMedia.connect(processor);
    // if the ScriptProcessorNode is not connected to an output the "onaudioprocess" event is not triggered in chrome
    processor.connect(userMedia.context._context.destination);
  }

  resetRecorder () {
    clearBuffers()
  }

  stopAndFinishRecording () {
    // recorder cleanup
    processor.disconnect();
    
    // combine audioBuffers
    const summedBuffer = combineBuffers();

    // encode mp3
    encode(summedBuffer, bufferSize); 
    blob = generateMp3Blob();
  }

  createBlobObjectUrl () {
    return window.URL.createObjectURL(blob);
  }

  getValues () {
    return analyser.analyse();
  }
}