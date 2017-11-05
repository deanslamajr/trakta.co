import React from 'react';
import { connect } from 'react-redux';
import viewportDimensions from 'viewport-dimensions';

import * as selectors from '../../../shared/reducers';

import {
  calculateInstanceRectangles,
  generateRectangle } from './calculateInstanceRectangles';

const padding = 5;

function drawRectangles(rowsOfRectangles, stagedSampleRectangle, viewportWidth, viewportHeight) {
  const rowsCount = rowsOfRectangles.length;
  const rowHeight = viewportHeight / rowsCount;

  const svgRectangles = rowsOfRectangles.reduce((rectangles, rowOfRectangles, index) => {
    const newRectangles = rowOfRectangles.map(({ scaledStartPos, scaledDuration, id }) => (
      <rect
        key={id}
        x={(scaledStartPos * viewportWidth)}
        y={(index * rowHeight) + padding}
        width={(scaledDuration * viewportWidth)}
        height={rowHeight - padding}
        fill='#cfcfcf'
        stroke='black'
        strokeWidth='.15'
        strokeLinecap='round'
      />
    ))

    return [...rectangles, ...newRectangles]
  }, []);

  // staged rectangle
  if (stagedSampleRectangle) {
    svgRectangles.push((
      <rect
        key={stagedSampleRectangle.id}
        x={(stagedSampleRectangle.scaledStartPos * viewportWidth)}
        y={padding}
        width={(stagedSampleRectangle.scaledDuration * viewportWidth)}
        height={viewportHeight - padding}
        fill='rgb(226,132,19)'
        stroke='black'
        strokeWidth='.15'
        strokeLinecap='round'
        fillOpacity='.25'
      />
    ))
  }

  return (
    <svg style={{ display: 'block' }} width={viewportWidth} height={viewportHeight}>
    { svgRectangles }
    </svg>
  );
}

const SampleInstances = ({ instances, trackDimensions, stagedSample }) => {
  if (instances.length === 0) {
    return null;
  }

  const {
    startTime,
    length
  } = trackDimensions

  const width = viewportDimensions 
    ? viewportDimensions.width() && viewportDimensions.width()
    : 300;
  const height = viewportDimensions
    ? viewportDimensions.height() && viewportDimensions.height()
    : 300;

  const samples = instances.map(
    instance => {
      return {
        start_time: instance.start_time,
        duration: instance.sample.duration,
        id: instance.id
      }
    }
  );

  let stagedSampleRectangle;
  if (stagedSample && stagedSample.duration) {
    const stagedSampleRectangleIngredients = {
      start_time: stagedSample.startTime,
      duration: stagedSample.duration,
      id: 'staged-sample'
    };
    stagedSampleRectangle = generateRectangle(startTime, length, stagedSampleRectangleIngredients);
  }

  const rowsOfRectangles = calculateInstanceRectangles(startTime, length, samples);

  return drawRectangles(rowsOfRectangles, stagedSampleRectangle, width, height);
}

function mapStateToProps(state) {
  return {
    instances: selectors.getInstances(state),
    trackDimensions: selectors.getTrackDimensions(state),
    stagedSample: selectors.getStagedSample(state)
  };
}

export default connect(mapStateToProps)(SampleInstances);