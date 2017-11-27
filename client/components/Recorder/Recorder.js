import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import viewportDimensions from 'viewport-dimensions';
import ReactAudioPlayer from 'react-audio-player';
import WaveformData from 'waveform-data';

import { setStagedObjectUrl, setStagedSample } from '../../../shared/actions/recorder';
import * as selectors from '../../../shared/reducers';

import { getSampleCreator } from './SampleCreator';

import styles from './Recorder.css'

function clearCanvas(ctx) {
  requestAnimationFrame(() => {
    const canvasWidth = ctx.canvas.width;
    const canvasHeight = ctx.canvas.height;
    
    ctx.beginPath();
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.closePath();
  })
}

class Recorder extends React.Component {
  constructor(props) {
    super(props);

    this.prompts = {
      START: this._renderSTART.bind(this),
      STOP: this._renderSTOP.bind(this),
      USER_MEDIA_DENIED: this._renderUSER_MEDIA_DENIED.bind(this)
    };

    this.state = {
      isRecording: false,
      disableRecording: true,
      currentPrompt: this.prompts.START,
      drawWave: false,
      duration: undefined
    };

    try {
      this.sampleCreator = getSampleCreator();
    }
    catch(error) {
      // Tone.UserMedia is not supported
      // @todo catch this earlier
    }

    this._startRecording = this._startRecording.bind(this);
    this._stopRecording = this._stopRecording.bind(this);
    this._beginDrawingWaves = this._beginDrawingWaves.bind(this);
    this._drawWave = this._drawWave.bind(this);
    this._drawSample = this._drawSample.bind(this);
    this._clickedRetry = this._clickedRetry.bind(this);
  }

  _beginDrawingWaves() {
    this.canvasContext = this.canvas.getContext('2d'); 

    // @todo have these resize with window resize
    this.canvasContext.canvas.width = this.canvas.width;
    this.canvasContext.canvas.height = this.canvas.height;

    // draw waves
    this.setState({ drawWave: true })

    this._drawWave();
  }

  _drawWave() {
    const canvasWidth = this.canvasContext.canvas.width;
    const canvasHeight = this.canvasContext.canvas.height;

    let x;
    let y;
    let isWhite = false;

    if (this.state.drawWave) {
      requestAnimationFrame(this._drawWave);
    }

    // draw the waveform
    const values = this.sampleCreator.getValues()
    //const values = this.analyser.analyse();

    this.canvasContext.beginPath();
    this.canvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
    this.canvasContext.lineJoin = 'round';
    if(this.state.isRecording) {
      this.canvasContext.lineWidth = 5;
      this.canvasContext.strokeStyle = 'red';
    }
    else {
      this.canvasContext.lineWidth = 2;
      this.canvasContext.strokeStyle = '#CCCCCC';
    }
    this.canvasContext.moveTo((values[0] / 255) * canvasWidth, canvasHeight);

    const now = Date.now();
    
    for (let i = values.length; i > 0; i--){
      if(this.state.isRecording) {
        if ((1-i/values.length) > ((now - this.state.recordingStartTime)/10000) && !isWhite) {
          isWhite = true;
          this.canvasContext.stroke();
          this.canvasContext.closePath();
          this.canvasContext.lineWidth = 2;
          this.canvasContext.strokeStyle = '#CCCCCC';
          this.canvasContext.beginPath();
          this.canvasContext.moveTo(x, y);
          this.canvasContext.lineJoin = 'round';
        }
      }
      const val = values[i] / (this.sampleCreator.resolution - 1);
      x = val * canvasWidth;
      y = (i / (this.sampleCreator.resolution - 1)) * canvasHeight;
      this.canvasContext.lineTo(x, y);
    }

    this.canvasContext.stroke();
    this.canvasContext.closePath();
  }

  _drawSample(buffer) {
    const waveFormData = WaveformData.create(buffer);
    waveFormData.offset(0, buffer.byteLength/4);

    const ctx = this.canvasContext;

    const canvasWidth = ctx.canvas.width;
    const canvasHeight = ctx.canvas.height;

    const interpolateHeight = (total_height) => {
      const amplitude = 256;
      return (size) => total_height - ((size + 128) * total_height) / amplitude;
    };
    const y = interpolateHeight(canvasHeight);

    ctx.beginPath();

    // from 0 to 100
    waveFormData.min.forEach((val, x) => ctx.lineTo(x + 0.5, y(val) + 0.5));

    // then looping back from 100 to 0
    waveFormData.max.reverse().forEach((val, x) => {
      ctx.lineTo((waveFormData.offset_length - x) + 0.5, y(val) + 0.5);
    });

    ctx.closePath();
    ctx.stroke();
  }

  _renderSTART() {
    return (
      <div>
        {
          this.state.disableRecording
            ? <div>Waiting on encoder to initialize</div>
            : (
                <div className={styles.blueMask} onClick={this._startRecording} >
                  <div className={styles.label}>
                    tap to BEGIN recording
                  </div>
                </div>
              )
        }
      </div>
    );
  }

  _startRecording() {
    this.sampleCreator.startRecording()

    this.setState({ 
      recordingStartTime: Date.now(),
      isRecording: true,
      currentPrompt: this.prompts.STOP
    });
  }

  _renderSTOP() {
    return (
      <div className={styles.redMask} onClick={this._stopRecording}>
        <div className={styles.label}>
          tap to END recording
        </div>
      </div>
    );
  }

  _navigateToCleanup() {
    this.props.history.push(`${this.props.match.url}/cleanup`);
  }

  _stopRecording() {
    this.setState({ 
      isRecording: false,
      drawWave: false
    });

    clearCanvas(this.canvasContext);

    this.sampleCreator.stopAndFinishRecording();
    const objectUrl = this.sampleCreator.createBlobObjectUrl();

    this.props.setStagedSample({
      startTime: 0,
      volume: 0,
      panning: 0,
      duration: 0
    });
    this.props.setStagedObjectUrl(objectUrl);

    this._navigateToCleanup()
  }

  _clickedRetry() {
    this.sampleCreator.resetRecorder();

    this.setState(
      { 
        currentPrompt: this.prompts.START,
        drawWave: true 
      }, 
      () => this._drawWave())
  }

  _renderUSER_MEDIA_DENIED() {
    return (
      <div>Welp, you blew it!</div>
    );
  }

  componentDidMount() {
    this.sampleCreator.openMic()
      .then(() => {
        // overlay 'start recording' mask
        this.setState({ disableRecording: false });
        this._beginDrawingWaves();
      })
      .catch(err => {
        console.error(err);
        // @todo log and metric
        this.setState({ currentPrompt: this.prompts.USER_MEDIA_DENIED });
      });
  }

  render() {
    // "- 5" to keep canvas within viewport i.e. no scrollbars
    const width = viewportDimensions 
      ? viewportDimensions.width() && viewportDimensions.width() - 5
      : 300;
    const height = viewportDimensions
      ? viewportDimensions.height() && viewportDimensions.height() - 5
      : 300;

    return (
      // @todo replace with imported css
      <div>
        { 
          this.sampleCreator
            ? (
              <div>
                {this.state.currentPrompt()}
              </div>
            )
            : (
              <div className={styles.notSupportedMessage}>
                WebAudio is not supported by this browser.
                <br/>
                Please upgrade this browser's version or switch to a browser that supports this technology.
                <br/>
                i.e. internet explorer, safari, and all iOS-based browsers will not be able to run this application
              </div>
            )
        }

        <canvas 
          className={styles.container}
          width={width} 
          height={height}
          ref={(canvas) => { this.canvas = canvas; }}
        />
      </div>
    );
  }
}

const mapActionsToProps = {
  setStagedObjectUrl,
  setStagedSample
};

function mapStateToProps(state) {
  return { objectUrl: selectors.getStagedObjectUrl(state) }
}

export default compose(
  withStyles(styles),
  connect(mapStateToProps, mapActionsToProps)
)(Recorder);