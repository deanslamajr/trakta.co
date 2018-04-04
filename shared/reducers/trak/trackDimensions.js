function isNotANumber (unknown) {
  return isNaN(parseFloat(unknown))
}

export function calculateTrackDimensions (instances) {
  let earliest = 0
  let latest = 0

  instances.forEach(instance => {
    if (isNotANumber(instance.start_time) || !instance.sample || isNotANumber(instance.sample.duration)) {
      return
    }

    if (isNotANumber(earliest)) {
      earliest = instance.start_time
    } else if (instance.start_time < earliest) {
      earliest = instance.start_time
    }

    const duration = instance.loop_count === 0
      ? instance.sample.duration
      : (instance.loop_count * instance.loop_padding) + instance.sample.duration

    const instanceEndTime = instance.start_time + duration
    if (isNotANumber(latest)) {
      latest = instanceEndTime
    } else if (latest < instanceEndTime) {
      latest = instanceEndTime
    }
  })

  return {
    startTime: earliest,
    length: latest - earliest
  }
}
