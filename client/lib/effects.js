import Tone from 'tone'

function createPitchShifter (effect) {
  return new Tone.PitchShift(effect.shiftInterval)
}

export const PITCH = 'PITCH'

export function instantiateActiveEffect (effects) {
  const activeEffect = effects.find(({ isActive }) => isActive)
  let instantiatedEffect

  if (activeEffect) {
    switch (activeEffect.type) {
      case PITCH:
        instantiatedEffect = createPitchShifter(activeEffect)
        break
    }
  }
  
  return instantiatedEffect
}