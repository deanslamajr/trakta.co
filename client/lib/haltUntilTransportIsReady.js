import Tone from 'tone'

/**
 * Mp3 Encoding results in Tone.Transport being unresponsive for an amount of time
 * proportional to the length of Mp3 encoding
 *
 * Consequently, don't proceed until Tone.Transport is responsive once again
 */
export default function haltUntilTransportIsReady () {
  console.log('beginning the halt')
  return new Promise(resolve => {
    Tone.Transport.cancel()
    Tone.Transport.loop = true
    Tone.Transport.setLoopPoints(0, 0.05)

    Tone.Transport.schedule((time) => {
      Tone.Transport.stop()
      Tone.Transport.cancel()
      console.log('halt finished')
      resolve()
    }, 0)

    Tone.Transport.start()
  })
}