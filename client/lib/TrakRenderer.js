import Encoder from './encoder'

/**
 * Private
 */
let trakRenderer
let buffer

function createTrakRenderer () {
  trakRenderer = new TrakRenderer()
}

export function getTrakRenderer () {
  if (!trakRenderer) {
    createTrakRenderer()
  }

  return trakRenderer
}

/**
 * Public
 */
export default class TrakRenderer {
  setBuffer (audioBuffer) {
    buffer = audioBuffer
  }

  getBlobFromBuffer () {
    if (!buffer) {
      throw new Error('buffer must be set via TrakRenderer#setBuffer before using TrakRenderer#getBlobUrlFromBuffer')
    }
    const mp3Encoder = new Encoder(buffer.sampleRate)
    // @todo if stereo is going to be supported on trakTacos, need to make a new Encoder method for that
    const encodedBuffer = mp3Encoder.encode(buffer.getChannelData(0))
    return mp3Encoder.createBlob(encodedBuffer)
  }
}
