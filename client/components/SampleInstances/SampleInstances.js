import React from 'react'
import { connect } from 'react-redux'
import viewportDimensions from 'viewport-dimensions'

import * as selectors from '../../../shared/reducers'

import { calculateInstanceRectangles } from './calculateInstanceRectangles'

const padding = 5
const STAGED_SAMPLE = 'staged-sample'

function drawRectangles (rowsOfRectangles, viewportWidth, viewportHeight) {
  const rowsCount = rowsOfRectangles.length
  const rowHeight = viewportHeight / rowsCount

  const svgRectangles = rowsOfRectangles.reduce((rectangles, rowOfRectangles, index) => {
    const newRectangles = rowOfRectangles.map(({ scaledStartPos, scaledDuration, id }) => (
      <rect
        key={id}
        x={(scaledStartPos * viewportWidth)}
        y={(index * rowHeight) + padding}
        width={(scaledDuration * viewportWidth)}
        height={rowHeight - padding}
        fill={id === STAGED_SAMPLE ? 'rgb(226,132,19)' : '#cfcfcf'}
        stroke='black'
        strokeWidth='.15'
        strokeLinecap='round'
      />
    ))

    return [...rectangles, ...newRectangles]
  }, [])

  return (
    <svg style={{ display: 'block' }} width={viewportWidth} height={viewportHeight}>
      { svgRectangles }
    </svg>
  )
}

const SampleInstances = ({ instances, trackDimensions, stagedSample }) => {
  if (instances.length === 0) {
    return null
  }

  const {
    startTime,
    length
  } = trackDimensions

  const width = viewportDimensions
    ? viewportDimensions.width() && viewportDimensions.width()
    : 300
  const height = viewportDimensions
    ? viewportDimensions.height() && viewportDimensions.height()
    : 300

  const samples = instances.map(instance => {
    const duration = instance.loop_count === 0
      ? instance.sample.duration
      : (instance.loop_count * instance.loop_padding) + instance.sample.duration

    return {
      start_time: instance.start_time,
      duration,
      id: instance.id
    }
  })

  if (stagedSample && stagedSample.duration) {
    const duration = stagedSample.loopCount === 0
      ? stagedSample.duration
      : (stagedSample.loopCount * stagedSample.loopPadding) + stagedSample.duration

    const stagedSampleRectangleIngredients = {
      start_time: stagedSample.startTime,
      duration,
      id: STAGED_SAMPLE
    }
    samples.push(stagedSampleRectangleIngredients)
  }

  const rowsOfRectangles = calculateInstanceRectangles(startTime, length, samples)

  return drawRectangles(rowsOfRectangles, width, height)
}

function mapStateToProps (state) {
  return {
    instances: selectors.getInstances(state),
    trackDimensions: selectors.getTrackDimensions(state),
    stagedSample: selectors.getStagedSample(state)
  }
}

export default connect(mapStateToProps)(SampleInstances)
