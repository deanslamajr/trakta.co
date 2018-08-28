import Tone from 'tone'

function createChorus (effect) {
  return new Tone.Chorus({ depth: effect.chorusDepth })
}

function createPitchShifter (effect) {
  return new Tone.PitchShift(effect.shiftInterval)
}

function createReverb (effect) {
  return new Tone.JCReverb(effect.roomSize)
}

function createDistortion (effect) {
  return new Tone.Distortion(effect.distortion)
}

export const PITCHSHIFT = 'pitchshift'
export const CHORUS = 'chorus'
export const REVERB = 'reverb'
export const DISTORTION = 'distortion'

export function instantiateActiveEffect (effects) {
  const activeEffect = effects.find(({ isActive }) => isActive)
  let instantiatedEffect

  if (activeEffect) {
    switch (activeEffect.type) {
      case CHORUS:
        instantiatedEffect = createChorus(activeEffect)
        break
      case PITCHSHIFT:
        instantiatedEffect = createPitchShifter(activeEffect)
        break
      case REVERB:
        instantiatedEffect = createReverb(activeEffect)
        break
      case DISTORTION:
        instantiatedEffect = createDistortion(activeEffect)
        break
    }
  }

  return instantiatedEffect
}
