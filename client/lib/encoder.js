import lamejs from 'lamejs'
import Tone from 'tone'

let mp3Encoder
let dataBuffer

function appendToDataBuffer (mp3Buf) {
  dataBuffer.push(new Int8Array(mp3Buf))
}

function convertBuffer (arrayBuffer) {
  // need to clone the incoming buffer otherwise we end up with
  // samples reflecting the sound coming from the microphone at the instant we stopped recording
  const data = new Float32Array(arrayBuffer)
  const output = new Int16Array(data.length)

  floatTo16BitPCM(data, output)
  return output
}

function floatTo16BitPCM (input, output) {
  for (let i = 0; i < input.length; i++) {
    const s = Math.max(-1, Math.min(1, input[i]))
    // magic bit shuffling
    output[i] = s < 0 ? s * 0x8000 : s * 0x7fff
  }
}

/**
 * Mp3 Encoding results in Tone.Transport being unresponsive for an amount of time
 * proportional to the length of Mp3 encoding
 *
 * Consequently, don't proceed until Tone.Transport is responsive once again
 */
function haltUntilTransportIsReady () {
  return new Promise(resolve => {
    Tone.Transport.cancel()
    Tone.Transport.loop = true
    // save looppoints
    const loopStart = Tone.Transport.loopStart
    const loopEnd = Tone.Transport.loopEnd

    Tone.Transport.setLoopPoints(0, 0.5)

    Tone.Transport.schedule((time) => {
      // reset looppoints
      Tone.Transport.setLoopPoints(loopStart, loopEnd)

      Tone.Transport.stop()
      Tone.Transport.cancel()

      resolve()
    }, 0)

    Tone.Transport.start()
  })
}

export default class Encoder {
  constructor (sampleRate) {
    mp3Encoder = new lamejs.Mp3Encoder(1, sampleRate, 128)
  }

  encode (arrayBuffer) {
    dataBuffer = []
    const samplesMono = convertBuffer(arrayBuffer)

    let remaining = samplesMono.length

    for (let i = 0; remaining >= 0; i++) {
      const left = samplesMono.subarray(i, i + 1)
      const mp3buf = mp3Encoder.encodeBuffer(left)

      appendToDataBuffer(mp3buf)
      remaining--
    }

    appendToDataBuffer(mp3Encoder.flush())

    return haltUntilTransportIsReady().then(() => dataBuffer)
  }

  createBlob (dataBuffer, startOfSplice, endOfSplice) {
    let start = Number(startOfSplice)
    let end = Number(endOfSplice)

    if (!start || start < 0 || start > dataBuffer.length) {
      start = 0
    }
    if (!end || end < 0 || end > dataBuffer.length || end < start) {
      end = dataBuffer.length
    }

    let bufferToBlob = Array.from(dataBuffer)
    bufferToBlob = bufferToBlob.slice(start, end + 1)

    return new Blob(bufferToBlob, { type: 'audio/mp3' }) // eslint-disable-line 
  }

  createBlobObjectUrl (blob) {
    return window.URL.createObjectURL(blob)
  }
}
