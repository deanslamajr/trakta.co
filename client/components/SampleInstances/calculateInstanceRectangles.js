function generateRectangle (trackWindowStart, trackWindowLength, { start_time, duration, id }) {
  // Calculate start position as fraction of total width
  const scaledStartPos = start_time > trackWindowStart
    ? (start_time - trackWindowStart) / trackWindowLength
    : 0;

  const durationBeforeTrackWindow = start_time < trackWindowStart
    ? trackWindowStart - start_time
    : 0

  const durationAfterTrackWindow = start_time + duration > trackWindowStart + trackWindowLength
    ? (start_time + duration) - (trackWindowStart + trackWindowLength)
    : 0

  const durationInTrackWindow = duration - durationBeforeTrackWindow - durationAfterTrackWindow

  const scaledDuration = durationInTrackWindow / trackWindowLength

  return { scaledStartPos, scaledDuration, id }
}

/**
 * Convert absolute instance values to the fractional values in the given track window
 * @param {Number} trackWindowStart
 * @param {Number} trackWindowLength
 * @param {Array<Object<start_time: Number, duration: Number, id: Number>>} instances
 * @return {Array<Object<scaledStartPos: Number, scaledDuration: Number, id: Number>>} array of converted data
 */
function generateRectangles (trackWindowStart, trackWindowLength, instances) {
  return instances.filter(({ start_time, duration }) => {
      return start_time + duration > trackWindowStart 
        && start_time < trackWindowStart + trackWindowLength
    })
    .map(generateRectangle.bind(null, trackWindowStart, trackWindowLength));
}

/**
 * Group rectangles into rows to ensure there are no collisions between rectangles on the same row
 * @param {Array<Object<scaledStartPos: Number, scaledDuration: Number, id: Number>>} rectangles
 * @return {Array<Array<Object<scaledStartPos: Number, scaledDuration: Number, id: Number>>>} array of rows
 */
function arrangeRectanglesIntoRows (rectangles) {
  let rectanglesCopy = Array.from(rectangles);
  rectanglesCopy.sort((a, b) => a.scaledStartPos - b.scaledStartPos);

  const arrangedRows = [];

  while(rectanglesCopy.length) {
    const tempArray = [];
    let currentInstance = rectanglesCopy.splice(0, 1)[0];
    const row = [currentInstance];

    while (rectanglesCopy.length) {     
      const nextInstance = rectanglesCopy.splice(0, 1)[0];
      if (nextInstance.scaledStartPos >= currentInstance.scaledStartPos + currentInstance.scaledDuration) {
        row.push(nextInstance);
        currentInstance = nextInstance;
      }
      else {
        tempArray.push(nextInstance)
      }
    }

    arrangedRows.push(row);
    rectanglesCopy = Array.from(tempArray);
  }

  return arrangedRows;
}

/**
 * generate the instructions to draw the instances that should appear on the given track viewport
 * @param {Number} trackWindowStart
 * @param {Number} trackWindowLength
 * @param {Array<Object<start_time: Number, duration: Number, id: String>>} instances
 * @return {Array<Array<Object<scaledStartPos: Number, scaledDuration: Number, id: String>>>} data to draw game board
 */
function calculateInstanceRectangles (trackWindowStart, trackWindowLength, instances) {
  const rectangles = generateRectangles(trackWindowStart, trackWindowLength, instances);
  return arrangeRectanglesIntoRows(rectangles);
}

export {
  calculateInstanceRectangles,
  arrangeRectanglesIntoRows,
  generateRectangles,
  generateRectangle
}