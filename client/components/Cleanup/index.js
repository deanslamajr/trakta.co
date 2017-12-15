import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import debounce from 'debounce';
import Tone from 'tone';
import ReactSlider from 'react-slider';

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

    this.state = {
      clipStart: 0,
      clipEnd: this.sampleCreator.getDataBufferLength()
    }

    this._onLeftSliderChange = this._onLeftSliderChange.bind(this)
    this._onLeftSliderFinish = this._onLeftSliderFinish.bind(this)
    this._onRightSliderChange = this._onRightSliderChange.bind(this)
    this._onRightSliderFinish = this._onRightSliderFinish.bind(this)

    this._renderSample = this._renderSample.bind(this);
    this.debouncedRenderSample = debounce(this._renderSample, 1000);
  }

  _clickUseThisSelection () {
    const rootPath = getRootPath(this.props.match.path);

    this.props.history.push(`/${rootPath}/staging`);
  }

  _updateState (type, value) {
    this.setState({ [type]: value })
  }
  
  _handleChange (type, event) {
    const parsedValue = parseFloat(event.target.value);
    this._updateState(type, parsedValue)
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
    })
  }

  _onLeftSliderChange (value) {
    // @todo update playback draw rectangle
  }

  _onRightSliderChange (value) {
    // @todo update playback draw rectangle
  }

  _onLeftSliderFinish (value) {
    this._updateState('clipStart', value)
  }

  _onRightSliderFinish (value) {
    this._updateState('clipEnd', value)
  }

  render() {
    const maxClipValue = this.sampleCreator.getDataBufferLength();
    const stepValue = Math.ceil(maxClipValue / 1000)

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
                    onChange={this._onLeftSliderChange}
                    max={maxClipValue}
                    step={stepValue}
                    onAfterChange={this._onLeftSliderFinish}
                  >
                    <svg width="96" height="144" xmlns="http://www.w3.org/2000/svg">
                        <g>
                          <rect fill="none" id="canvas_background" height="146" width="98" y="-1" x="-1"/>
                        </g>
                        <g>
                          <path stroke="#000000" id="svg_11" d="m0.55582,53.17546l12.68336,-33.12395l21.96661,-19.12553l25.36672,0l21.96661,19.12553l12.68336,33.12395l0,38.25106l-12.68336,33.12395l-21.96661,19.12552l-25.36672,0l-21.96661,-19.12552l-12.68336,-33.12395l0,-38.25106z" strokeWidth="0.5" fill="none"/>
                          <path stroke="#000000" transform="rotate(-179.62478637695312 48.03125000000001,112.3503189086914) " id="svg_13" d="m31.19168,112.27864l16.83957,-29.78879l16.83957,29.78879l-8.41981,0l0,29.93214l-16.83954,0l0,-29.93214l-8.41981,0z" strokeWidth="0.5" fill="#1cffe0"/>
                          <path stroke="#000000" id="svg_14" d="m31.19122,31.94578l16.83957,-29.78879l16.83957,29.78879l-8.4198,0l0,29.93214l-16.83954,0l0,-29.93214l-8.4198,0z" strokeWidth="0.5" fill="#1cffe0"/>
                        </g>
                      </svg>
                  </ReactSlider>

                  <ReactSlider
                    orientation='vertical'
                    className={styles.sliderRight}
                    onChange={this._onRightSliderChange}
                    max={maxClipValue}
                    defaultValue={maxClipValue}
                    step={stepValue}
                    onAfterChange={this._onRightSliderFinish}
                  >
                      <svg width="96" height="144" xmlns="http://www.w3.org/2000/svg">
                        <g>
                          <rect fill="none" id="canvas_background" height="146" width="98" y="-1" x="-1"/>
                        </g>
                        <g>
                          <path stroke="#000000" id="svg_11" d="m0.55582,53.17546l12.68336,-33.12395l21.96661,-19.12553l25.36672,0l21.96661,19.12553l12.68336,33.12395l0,38.25106l-12.68336,33.12395l-21.96661,19.12552l-25.36672,0l-21.96661,-19.12552l-12.68336,-33.12395l0,-38.25106z" strokeWidth="0.5" fill="none"/>
                          <path stroke="#000000" transform="rotate(-179.62478637695312 48.03125000000001,112.3503189086914) " id="svg_13" d="m31.19168,112.27864l16.83957,-29.78879l16.83957,29.78879l-8.41981,0l0,29.93214l-16.83954,0l0,-29.93214l-8.41981,0z" strokeWidth="0.5" fill="#1cffe0"/>
                          <path stroke="#000000" id="svg_14" d="m31.19122,31.94578l16.83957,-29.78879l16.83957,29.78879l-8.4198,0l0,29.93214l-16.83954,0l0,-29.93214l-8.4198,0z" strokeWidth="0.5" fill="#1cffe0"/>
                        </g>
                      </svg>
                  </ReactSlider>
                </div>

                <div className={styles.playButton} onClick={playArrangement}>
                  PLAY
                </div>
                {/* {this._renderClippingInputs()}
                <div className={styles.saveButton} onClick={this._clickUseThisSelection}>Use this selection</div> */}

                <canvas 
                  className={styles.canvas}
                  width={ this.state.canvasWidth || 0} 
                  height= { this.state.canvasHeight || 0} 
                  ref={(canvas) => { this.canvas = canvas; }}
                />
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