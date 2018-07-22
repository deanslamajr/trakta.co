import React from 'react'
import PropTypes from 'prop-types'
import viewportDimensions from 'viewport-dimensions'

import { unitLength, unitDuration } from '../../lib/units'
import calculateInstanceRectangles from './calculateInstanceRectangles'

const padding = 1
const STAGED_SAMPLE = 'staged-sample'

function drawRectangles (columnsOfRectangles, viewportWidth, trakHeight) {
  const columnsCount = columnsOfRectangles.length
  const totalPaddingWidth = (columnsCount + 1) * padding
  const viewportWidthWithoutPadding = viewportWidth - totalPaddingWidth
  const columnWidth = viewportWidthWithoutPadding / columnsCount

  const svgRectangles = columnsOfRectangles.reduce((rectangles, columnOfRectangles, index) => {
    const newRectangles = columnOfRectangles.map(({ scaledSequencerPositions, scaledDuration, id }) => (
      <rect
        key={id}
        y={(scaledSequencerPositions[0])}
        x={((index + 1) * padding) + (index * columnWidth)}
        width={columnWidth}
        height={scaledDuration}
        fill={id === STAGED_SAMPLE ? 'rgb(226,132,19)' : '#cfcfcf'}
        stroke='black'
        strokeWidth='.15'
        strokeLinecap='round'
      />
    ))

    return [...rectangles, ...newRectangles]
  }, [])

  return (
    <svg style={{ display: 'block' }} width={viewportWidth} height={trakHeight}>
      { svgRectangles }
    </svg>
  )
}

const SampleInstances = ({ instances = [] }) => {
  if (instances.length === 0) {
    return null
  }

  const viewportWidth = viewportDimensions
    ? viewportDimensions.width() && viewportDimensions.width()
    : 300

  const trakDuration = instances[0].trak.duration

  const pixelsPerSecond = (unitLength + 1) / unitDuration
  const trakHeight = trakDuration * pixelsPerSecond

  const samples = instances.map(instance => {
    return {
      sequencerCsv: instance.sequencer_csv,
      sampleDuration: instance.sample.duration,
      id: instance.id
    }
  })

  const columnsOfRectangles = calculateInstanceRectangles(samples)

  return drawRectangles(columnsOfRectangles, viewportWidth, trakHeight)
}

SampleInstances.propTypes = {
  instances: PropTypes.arrayOf(PropTypes.shape({
    created_at: PropTypes.string,
    id: PropTypes.string,
    player_id: PropTypes.string,
    sample: PropTypes.shape({
      id: PropTypes.string,
      url: PropTypes.string,
      duration: PropTypes.number,
      player_id: PropTypes.string,
      created_at: PropTypes.string,
      updated_at: PropTypes.string
    }),
    sample_id: PropTypes.string,
    sequencer_csv: PropTypes.string,
    trak: PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      created_at: PropTypes.string,
      contribution_count: PropTypes.number,
      last_contribution_date: PropTypes.string,
      originators_player_id: PropTypes.string,
      duration: PropTypes.number,
      plays_count: PropTypes.number,
      updated_at: PropTypes.string
    }),
    trak_id: PropTypes.string,
    updated_at: PropTypes.string,
    version_id: PropTypes.string
  }))
}

export default SampleInstances
