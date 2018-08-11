import Encoder from './encoder'

/**
 * Private
 */
let trakRenderer

function createTrakRenderer () {
  trakRenderer = new TrakRenderer()
}

function createBlobFromBuffer (buf, mp3Encoder) {
  // @todo if stereo is going to be supported on trakTacos, need to make a new Encoder method for that
  const encodedBuffer = mp3Encoder.encode(buf.getChannelData(0))
  return mp3Encoder.createBlob(encodedBuffer)
}

/**
 * Public
 */
export function getTrakRenderer () {
  if (!trakRenderer) {
    createTrakRenderer()
  }

  return trakRenderer
}

export default class TrakRenderer {
  getBlobFromBuffer (bufferToBlobify) {
    const mp3Encoder = new Encoder(bufferToBlobify.sampleRate)
    return createBlobFromBuffer(bufferToBlobify, mp3Encoder)
  }
}
