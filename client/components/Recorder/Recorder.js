import React from 'react';
import viewportDimensions from 'viewport-dimensions';
import Tone from 'tone';

const resolution = 256;

class Recorder extends React.Component {
  constructor(props) {
    super(props);

    console.log('taco!!');

    this.prompts = {
      START: this._renderInitializingRecorderPrompt.bind(this)
    };

    this.state = {
      disableRecording: true,
      currentPrompt: this.prompts.START,
      userMediaSupported: Tone.UserMedia.supported,
      // @todo remove
      blob: undefined
    };

    if (Tone.UserMedia.supported) {
      this.userMedia = new Tone.UserMedia();

      this.analyser = new Tone.Analyser({
        type : 'waveform',
        size : resolution
      });

      // streams
      this.userMedia.connect(this.analyser);
    }

    this._renderUserMediaSupported = this._renderUserMediaSupported.bind(this);
    this._renderStartRecordingPrompt = this._renderStartRecordingPrompt.bind(this);
    // this._startRecording = this._startRecording.bind(this);
    this._drawBlobs = this._drawBlobs.bind(this);
    this._openRecorderAndBeginDrawingWaves = this._openRecorderAndBeginDrawingWaves.bind(this);
    this._drawWave = this._drawWave.bind(this);
    this._renderUserMediaNotSupported = this._renderUserMediaNotSupported.bind(this);
  }

  _openRecorderAndBeginDrawingWaves() {
    this.context = this.canvas.getContext('2d');

    // @todo have these resize with window resize
    this.context.canvas.width = this.canvas.width;
    this.context.canvas.height = this.canvas.height;

    this._drawWave();
  }

  _drawWave() {
    const canvasWidth = this.context.canvas.width;
    const canvasHeight = this.context.canvas.height;

    // @todo do we need to be able to clean this up? or will we beable to do a redirect to another page to clear this work?
    requestAnimationFrame(this._drawWave);

    // draw the waveform
    const values = this.analyser.analyse();

    this.context.clearRect(0, 0, canvasWidth, canvasHeight);
    this.context.beginPath();
    this.context.lineJoin = 'round';
    this.context.lineWidth = 2;
    this.context.strokeStyle = '#CCCCCC';
    this.context.moveTo((values[0] / 255) * canvasWidth, 0);
    
    for (let i = 1; i < values.length; i++){
      const val = values[i] / (resolution - 1);
      const x = val * canvasWidth;
      const y = (i / (resolution - 1)) * canvasHeight;
      this.context.lineTo(x, y);
    }

    this.context.stroke();
  }

  _renderInitializingRecorderPrompt() {
    return (
      <div>
        {
          this.state.disableRecording
            ? <div>Waiting on encoder to initialize</div>
            : this._renderStartRecordingPrompt()
        }
      </div>
    );
  }

  _renderStartRecordingPrompt() {
    return (
      <div>
        { /* overlay start mask e.g. <button onClick={this._startRecording} class='green-mask'>Start</button> */ }
      </div>
    );
  }

  _renderUserMediaSupported() {
    // "- 5" to keep canvas within viewport i.e. no scrollbars
    const width = viewportDimensions 
      ? viewportDimensions.width() && viewportDimensions.width() - 5
      : 300;
    const height = viewportDimensions
      ? viewportDimensions.height() && viewportDimensions.height() - 5
      : 300;


    





    return (
      <div>
        {this.state.currentPrompt()}
        { /* @todo remove this */ this._drawBlobs()}
        <canvas 
          width={width} 
          height={height}
          ref={(canvas) => { this.canvas = canvas; }}
        />
      </div>
    );
  }

  _drawBlobs() {
    return (
      <div>
        {this.state.blob
          ? <ReactAudioPlayer src={window.URL.createObjectURL(this.state.blob)} controls />
          : null}
        {this.state.backedupBlob
          ? <ReactAudioPlayer src={window.URL.createObjectURL(this.state.backedupBlob)} controls />
          : null}
      </div>
    );
  }

  _renderUserMediaNotSupported() {
    return (
      // @todo replace with imported css
      <div style={{ color: 'white' }}>
        WebAudio is not supported by this browser.
        <br/>
        Please upgrade this browser's version or switch to a browser that supports this technology.
        <br/>
        i.e. internet explorer, safari, and all iOS-based browsers will not be able to run this application
      </div>
    );
  }

  componentDidMount() {
    // opening the input asks the user to activate their mic
    this.userMedia.open()
      .then(() => {
        // starts letting audio through
        // this.userMedia.start(10);
        
        // overlay 'start recording' mask
        this.setState({ disableRecording: false });
        this._openRecorderAndBeginDrawingWaves();
      })
      .catch(err => {
        console.error(err);
        // @todo log and metric
        alert('user rejected userMedia request!');
      });
  }

  render() {
    console.log('taco!!');

    return (
      // @todo replace with imported css
      <div style={{ textAlign: 'center' }}>
        { 
          this.state.userMediaSupported 
            ? this._renderUserMediaSupported() 
            : this._renderUserMediaNotSupported() 
        }
      </div>
    );
  }
}

export default Recorder;