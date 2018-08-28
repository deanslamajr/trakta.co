import Tone from 'tone'
import Encoder from './encoder'

/**
 * Private
 */
let sampleCreator
let userMedia
let analyser
let mp3Encoder
let dataBuffer
let audioBuffers
let processor
let reducedSet
let drawSet

function clearBuffers () {
  dataBuffer = []
  audioBuffers = []
  drawSet = []
}

function processAudioEvent (event) {
  const float32Array = event.inputBuffer.getChannelData(0)
  const arrayBuffer = float32Array.buffer.slice()

  audioBuffers.push(arrayBuffer)

  // Uint8Array
  const valuesTypedArray = analyser.analyse()
  for (let i = 0; i < valuesTypedArray.length; i++) {
    drawSet.push(valuesTypedArray[i])
  }
}

function combineBuffers () {
  let combinedArrayBuffer = audioBuffers[0]
  for (let i = 1; i < audioBuffers.length; i++) {
    combinedArrayBuffer = appendBuffer(combinedArrayBuffer, audioBuffers[i])
  }
  return combinedArrayBuffer
}

/**
 * Creates a new Uint8Array based on two different ArrayBuffers
 *
 * @param {ArrayBuffer} buffer1 The first buffer.
 * @param {ArrayBuffer} buffer2 The second buffer.
 * @return {ArrayBuffer} The new ArrayBuffer created out of the two.
 */
function appendBuffer (buffer1, buffer2) {
  var tmp = new Uint8Array(buffer1.byteLength + buffer2.byteLength)
  tmp.set(new Uint8Array(buffer1), 0)
  tmp.set(new Uint8Array(buffer2), buffer1.byteLength)
  return tmp.buffer
};

function generateRandomIndex (min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min)) + min // The maximum is exclusive and the minimum is inclusive
}

function generateWaveForm (samplingPeriod) {
  reducedSet = []

  for (let index = samplingPeriod; index < drawSet.length; index += samplingPeriod) {
    const randomIndex = generateRandomIndex(index - samplingPeriod, index)
    reducedSet.push(drawSet[randomIndex])
  }
}

/**
 * Public
 */
export default class SampleCreator {
  constructor () {
    this.resolution = 256

    if (Tone.UserMedia.supported) {
      userMedia = new Tone.UserMedia()

      analyser = new Tone.Analyser({
        type: 'waveform',
        size: this.resolution
      })

      // @todo add gain node here too
      // const gain = new Tone.Gain(.1)

      // userMedia.connect(gain)
      // gain.connect(analyser);

      userMedia.connect(analyser)
    } else {
      // @todo do this better
      throw new Error('Tone.UserMedia is not supported')
    }
  }

  clipBlobAndReturnObjectUrl (start, stop) {
    const blob = mp3Encoder.createBlob(dataBuffer, start, stop)
    return mp3Encoder.createBlobObjectUrl(blob)
  }

  getReducedSet (canvasHeight) {
    const samplingPeriod = drawSet.length / canvasHeight
    generateWaveForm(samplingPeriod)
    return reducedSet
  }

  getDataBufferLength () {
    return dataBuffer.length
  }

  openMic () {
    return userMedia.open() // opening the input asks the user to activate their mic
      .then(() => {
        // save a reference to the AudioContext
        const context = userMedia.context._context

        mp3Encoder = new Encoder(context.sampleRate)
        clearBuffers()

        // a bufferSize of 0 instructs the browser to choose the best bufferSize
        processor = context.createScriptProcessor(0, 1, 1)
        processor.onaudioprocess = processAudioEvent

        // @todo tweak this for best performance
        // @see{https://tonejs.github.io/docs/#Context}
        // userMedia.context.latencyHint = 'balanced';
      })
  }

  startRecording () {
    // @todo add gain node here too
    // const gain = new Tone.Gain(.1)

    // userMedia.connect(gain)
    // gain.connect(processor);

    userMedia.connect(processor)

    // if the ScriptProcessorNode is not connected to an output the "onaudioprocess" event is not triggered in chrome
    processor.connect(userMedia.context._context.destination)
  }

  resetRecorder () {
    clearBuffers()
  }

  stopAndFinishRecording () {
    // recorder cleanup
    processor.disconnect()

    // combine audioBuffers
    const summedBuffer = combineBuffers()

    // encode mp3
    dataBuffer = mp3Encoder.encode(summedBuffer)

    const blob = mp3Encoder.createBlob(dataBuffer)
    const objectUrl = mp3Encoder.createBlobObjectUrl(blob)

    return new Promise((resolve, reject) => {
      new Tone.Buffer(objectUrl, // eslint-disable-line 
        // success
        resolve,
        // error
        // @todo log, set error view state (w/ try again functionality)
        error => {
          console.error(error)
          reject(error)
        }
      )
    })
  }

  createBuffer (objectUrl) {
    return new Promise((resolve, reject) => {
      new Tone.Buffer(objectUrl, // eslint-disable-line 
        // success
        resolve,
        // error
        // @todo log, set error view state (w/ try again functionality)
        error => {
          console.error(error)
          reject(error)
        }
      )
    })
  }

  getValues () {
    return analyser.analyse()
  }
}

function createSampleCreator () {
  sampleCreator = new SampleCreator()
  return sampleCreator
}

export function getSampleCreator () {
  if (!sampleCreator) {
    createSampleCreator()
  }

  return sampleCreator
}
