import Tone from 'tone'

// rem to px
// eslint-disable-next-line no-undef
const unitLengthInPixelsString = getComputedStyle(document.documentElement).fontSize
const unitLength = Number(unitLengthInPixelsString.substring(0, unitLengthInPixelsString.length - 2))

const unitDuration = (new Tone.Time(`0:0:1`)).toSeconds()

export {
  unitLength,
  unitDuration
}
