import Encoder from './encoder'

/**
 * Private
 */
let trakRenderer
let buffer

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
  setBuffer (audioBuffer) {
    buffer = audioBuffer
  }

  getBlobFromBuffer () {
    if (!buffer) {
      throw new Error('buffer must be set via TrakRenderer#setBuffer before using TrakRenderer#getBlobUrlFromBuffer')
    }
    const mp3Encoder = new Encoder(buffer.sampleRate)
    return createBlobFromBuffer(buffer, mp3Encoder)
  }

  createObjectUrlFromBuffer(buf) {
    const mp3Encoder = new Encoder(buf.sampleRate)
    const blob = createBlobFromBuffer(buf, mp3Encoder)
    return mp3Encoder.createBlobObjectUrl(blob)
  }
}
