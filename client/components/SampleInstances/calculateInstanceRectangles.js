import { unitLength, unitDuration } from '../../lib/units'

function convertSampleTimesToPixels ({ sampleDuration, id, sequencerCsv }) {
  // convert from csv positions to viewport scale

  const sequencerPositionsArray = sequencerCsv.split(',')
  const scaledSequencerPositions = sequencerPositionsArray.map(position => {
    /**
     * Account for 1 px border of sequencer items
     * 1px for top border on of first item
     * 2px for each set of four sequencer items
     **/
    const setOfFourIndex = Math.floor(position / 4)
    const sequencerItemBorderSpacing = 1 + (setOfFourIndex * 2)
    return (position * unitLength) + sequencerItemBorderSpacing
  })

  const sampleUnitCount = sampleDuration / unitDuration
  const scaledSampleDuration = sampleUnitCount * unitLength
  const scaledDuration = scaledSequencerPositions[scaledSequencerPositions.length - 1] + scaledSampleDuration

  return {
    id,
    scaledDuration,
    scaledSequencerPositions
  }
}

/**
 * Group rectangles into rows to ensure there are no collisions between rectangles on the same row
 * @param {Array<Object<scaledStartPos: Number, scaledDuration: Number, id: Number>>} rectangles
 * @return {Array<Array<Object<scaledStartPos: Number, scaledDuration: Number, id: Number>>>} array of rows
 */
function arrangeRectanglesIntoColumns (rectangles) {
  let rectanglesCopy = Array.from(rectangles)
  rectanglesCopy.sort((a, b) => a.scaledSequencerPositions[0] - b.scaledSequencerPositions[0])

  const arrangedColumns = []

  while (rectanglesCopy.length) {
    const tempArray = []
    let currentInstance = rectanglesCopy.splice(0, 1)[0]
    const column = [currentInstance]

    while (rectanglesCopy.length) {
      const nextInstance = rectanglesCopy.splice(0, 1)[0]
      if (nextInstance.scaledSequencerPositions[0] >= currentInstance.scaledSequencerPositions[0] + currentInstance.scaledDuration) {
        column.push(nextInstance)
        currentInstance = nextInstance
      } else {
        tempArray.push(nextInstance)
      }
    }

    arrangedColumns.push(column)
    rectanglesCopy = Array.from(tempArray)
  }

  return arrangedColumns
}

/**
 * generate the instructions to draw the instances that should appear on the given track viewport
 * @param {Number} trackWindowStart
 * @param {Number} trackWindowLength
 * @param {Array<Object<start_time: Number, duration: Number, id: String>>} instances
 * @return {Array<Array<Object<scaledStartPos: Number, scaledDuration: Number, id: String>>>} data to draw game board
 */
function calculateInstanceRectangles (samples) {
  const rectangles = samples.map(sample => convertSampleTimesToPixels(sample))
  return arrangeRectanglesIntoColumns(rectangles)
}

export default calculateInstanceRectangles
