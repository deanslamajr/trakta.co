import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import debounce from 'debounce';
import Tone from 'tone';
import ReactSlider from 'react-slider';
import classnames from 'classnames';

import * as selectors from '../../../shared/reducers';
import { setStagedObjectUrl } from '../../../shared/actions/recorder';

import { getSampleCreator } from '../Recorder/SampleCreator';

import styles from './cleanup.css'

let samplePlayer

function getRootPath (fullPath) {
  const pathTokens = fullPath.split('/');
  return pathTokens[1] || ''
}

function playArrangement() {
  if (Tone.Transport.state === 'started') {
    Tone.Transport.stop()
  }
  else {
    Tone.Transport.start();
  }
}

class Cleanup extends React.Component {
  constructor (props) {
    super(props);

    try {
      this.sampleCreator = getSampleCreator();
    }
    catch(error) {
      // Tone.UserMedia is not supported
      // @todo catch this earlier
      console.error(error)
    }

    const initialStartValue = Math.ceil(0.2 * (this.sampleCreator.getDataBufferLength()))
    const initialEndValue = Math.ceil(0.8 * (this.sampleCreator.getDataBufferLength()))

    this.state = {
      leftSliderValue: initialStartValue,
      rightSliderValue: initialEndValue,
      clipStart: initialStartValue,
      clipEnd: initialEndValue
    }

    this._onLeftSliderChange = this._onLeftSliderChange.bind(this)
    this._onLeftSliderFinish = this._onLeftSliderFinish.bind(this)
    this._onRightSliderChange = this._onRightSliderChange.bind(this)
    this._onRightSliderFinish = this._onRightSliderFinish.bind(this)
    this._playRecording = this._playRecording.bind(this)
    this._stopRecording = this._stopRecording.bind(this)
    this._clickUseThisSelection = this._clickUseThisSelection.bind(this)

    this._renderSample = this._renderSample.bind(this);
    this.debouncedRenderSample = debounce(this._renderSample, 1000);
  }

  _clickUseThisSelection () {
    const rootPath = getRootPath(this.props.match.path);

    this.props.history.push(`/${rootPath}/staging`);
  }

  _renderSample(start, stop) {
    this.sampleCreator.createBlob(start, stop)

    const objectUrl = this.sampleCreator.createBlobObjectUrl();

    this.sampleCreator.createBuffer(objectUrl)
      .then(buffer => {
        // clear the transport 
        Tone.Transport.cancel();
        samplePlayer = new Tone.Player(buffer);
        samplePlayer.loop = true;
        samplePlayer.toMaster().sync().start(0);
      })

    this.props.setStagedObjectUrl(objectUrl);
  }

  _drawWaveForm() {
    const canvasWidth = this.canvasContext.canvas.width;
    const canvasHeight = this.canvasContext.canvas.height;

    let x;

    // draw the waveform
    const values = this.sampleCreator.getReducedSet(this.state.canvasHeight)

    this.canvasContext.beginPath();
    this.canvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
    this.canvasContext.lineJoin = 'round';
    this.canvasContext.lineWidth = 1;
    this.canvasContext.strokeStyle = '#CCCCCC';

    this.canvasContext.moveTo((values[0] / 255) * canvasWidth, canvasHeight);
    
    for (let i = values.length; i > 0; i--){
      const val = values[i]/ (this.sampleCreator.resolution - 1);
      x = val * canvasWidth;
      this.canvasContext.lineTo(x, i);
    }

    this.canvasContext.stroke();
    this.canvasContext.closePath();
  }

  _stopRecording() {
    playArrangement();
    this.props.addItemToNavBar((
      <button onClick={this._playRecording}>PLAY recording</button>
    ));
  }

  _playRecording() {
    playArrangement()
    this.props.addItemToNavBar((
      <button onClick={this._stopRecording}>STOP playback</button>
    ))
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.state.clipStart != nextState.clipStart || this.state.clipEnd != nextState.clipEnd) {
      this.debouncedRenderSample(nextState.clipStart, nextState.clipEnd);
    }
  }

  componentDidMount() {
    const height = this.container
        ? this.container.parentNode.clientHeight
        : 0;
    const width = this.container
        ? this.container.parentNode.clientWidth
        : 0;

    this.setState({
      canvasWidth: width * .7,
      canvasHeight: height
    }, () => {
      this.canvasContext = this.canvas.getContext('2d');

      // @todo have these resize with window resize
      this.canvasContext.canvas.width = this.state.canvasWidth;
      this.canvasContext.canvas.height = this.state.canvasHeight;

      this._drawWaveForm();
      this._renderSample();

      this.props.addItemToNavBar((
        <button onClick={this._playRecording}>PLAY recording</button>
      ),(
        <button onClick={this._clickUseThisSelection}>USE this selection</button>
      ));
    })
  }

  _onLeftSliderChange (value) {
    this.setState({ leftSliderValue: value });
  }

  _onRightSliderChange (value) {
    this.setState({ rightSliderValue: value });
  }

  _onLeftSliderFinish (value) {
    this.setState({
      clipStart: value,
      leftSliderValue: value
    });
  }

  _onRightSliderFinish (value) {
    this.setState({
      clipEnd: value,
      rightSliderValue: value });
  }

  render() {
    const maxClipValue = this.sampleCreator.getDataBufferLength();
    const stepValue = Math.ceil(maxClipValue / 1000)

    const top = this.state.canvasHeight * (this.state.leftSliderValue/maxClipValue);
    const bottom = this.state.canvasHeight - (this.state.canvasHeight * (this.state.rightSliderValue/maxClipValue));

    return (
      <div ref={(container) => { this.container = container; }}>
        <div className={styles.label}>
          {
            this.props.objectUrl && 
            (
              <div>
                <div>
                  <ReactSlider
                    orientation='vertical'
                    className={styles.sliderLeft}
                    handleClassName={classnames(styles.leftHandle, styles.handle)}
                    onChange={this._onLeftSliderChange}
                    max={maxClipValue}
                    step={stepValue}
                    onAfterChange={this._onLeftSliderFinish}
                    defaultValue={this.state.clipStart}
                  />
                  <ReactSlider
                    orientation='vertical'
                    className={styles.sliderRight}
                    handleClassName={classnames(styles.rightHandle, styles.handle)}
                    onChange={this._onRightSliderChange}
                    max={maxClipValue}
                    step={stepValue}
                    onAfterChange={this._onRightSliderFinish}
                    defaultValue={this.state.clipEnd}
                  />
                </div>

                <canvas 
                  className={styles.canvas}
                  width={ this.state.canvasWidth || 0} 
                  height= { this.state.canvasHeight || 0} 
                  ref={(canvas) => { this.canvas = canvas; }}
                />
                <div style={{ top: `${top}px`, bottom: `${bottom}px` }} className={styles.canvasMask}></div>
              </div>
            )
          }
        </div>
      </div>
    )
  }
}

const mapActionsToProps = {
  setStagedObjectUrl
};

function mapStateToProps(state) {
  return { objectUrl: selectors.getStagedObjectUrl(state) }
}

export default compose(
  withStyles(styles),
  connect(mapStateToProps, mapActionsToProps)
)(Cleanup);