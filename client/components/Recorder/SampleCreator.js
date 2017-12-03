import Tone from 'tone';
import lamejs from 'lamejs';

/**
 * Private
 */
let sampleCreator
let userMedia;
let analyser;
let mp3Encoder;
let dataBuffer;
let audioBuffers;
let processor;
let bufferSize;
let summedBuffer;
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

function encode(arrayBuffer) {
  const samplesMono = convertBuffer(arrayBuffer);

  let remaining = samplesMono.length;
  for (let i = 0; remaining >= 0; i++) {
    const left = samplesMono.subarray(i, i + 1);
    const mp3buf = mp3Encoder.encodeBuffer(left);
    appendToDataBuffer(mp3buf);
    remaining--;
  }
  appendToDataBuffer(mp3Encoder.flush());
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

function appendToDataBuffer(mp3Buf) {
  dataBuffer.push(new Int8Array(mp3Buf));
}

function generateMp3Blob(startOfSplice, endOfSplice) {
  let start = Number(startOfSplice);
  let end = Number(endOfSplice);

  if (!start || start < 0 || start > dataBuffer.length) {
    start = 0;
  }
  if (!end || end < 0 || end > dataBuffer.length || end < start) {
    end = dataBuffer.length;
  }

  let bufferToBlob = Array.from(dataBuffer);
  bufferToBlob = bufferToBlob.slice(start, end + 1)

  return new Blob(bufferToBlob, { type: 'audio/mp3' });
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
      // @todo do this better
      throw new Error('Tone.UserMedia is not supported')
    }
  }

  getDataBufferLength () {
    return dataBuffer.length
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
    summedBuffer = combineBuffers();
    
    // encode mp3
    encode(summedBuffer);

    // create blob and return the size of the recording
    this.createBlob()
  }

  createBlobObjectUrl () {
    return window.URL.createObjectURL(blob);
  }

  createBlob (start, stop) {
    blob = generateMp3Blob(start, stop);
  }

  getValues () {
    return analyser.analyse();
  }
}

function createSampleCreator () {
  sampleCreator = new SampleCreator();
  return sampleCreator;
}

export function getSampleCreator () {
  if (!sampleCreator) {
    createSampleCreator();
  }

  return sampleCreator;
}