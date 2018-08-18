import Tone from 'tone'

function createChorus (effect) {
  return new Tone.Chorus({ depth: effect.chorusDepth })
}

function createPitchShifter (effect) {
  return new Tone.PitchShift(effect.shiftInterval)
}

export const PITCHSHIFT = 'pitchshift'
export const CHORUS = 'chorus'

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
    }
  }
  
  return instantiatedEffect
}