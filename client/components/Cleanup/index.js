import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import ReactAudioPlayer from 'react-audio-player';
import debounce from 'debounce';

import * as selectors from '../../../shared/reducers';
import { setStagedObjectUrl } from '../../../shared/actions/recorder';

import { getSampleCreator } from '../Recorder/SampleCreator';

import styles from './cleanup.css'

function getRootPath (fullPath) {
  const pathTokens = fullPath.split('/');
  return pathTokens[1] || ''
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

    this._renderSample = this._renderSample.bind(this);
    this.debouncedRenderSample = debounce(this._renderSample, 1000);
  }

  _clickedRetry () {
    const rootPath = getRootPath(this.props.match.path);

    this.props.history.goBack();
  }

  _clickUseThisSelection () {
    const rootPath = getRootPath(this.props.match.path);

    this.props.history.push(`/${rootPath}/staging`);
  }
  
  _handleChange (type, event) {
    const parsedValue = parseFloat(event.target.value);
    this.setState({ [type]: parsedValue })
  }

  _renderClippingInputs () {
    const maxClipValue = this.sampleCreator.getDataBufferLength()

    return (
      <div>
        (min: 0, max: {maxClipValue})

        <label htmlFor='start'>start position</label>
        <input id='start'
          type='number'
          step='0.01'
          value={this.state.clipStart}
          onChange={this._handleChange.bind(this, 'clipStart')}
          className={styles.formInput} />

        <label htmlFor='end'>end position</label>
        <input id='end'
          type='number'
          step='0.01'
          value={this.state.clipEnd}
          onChange={this._handleChange.bind(this, 'clipEnd')}
          className={styles.formInput} />
      </div>
    )
  }

  _renderSample(start, stop) {
    this.sampleCreator.createBlob(start, stop)

    const objectUrl = this.sampleCreator.createBlobObjectUrl();

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
      canvasWidth: width,
      canvasHeight: height
    }, () => {
      this.canvasContext = this.canvas.getContext('2d');

      // @todo have these resize with window resize
      this.canvasContext.canvas.width = this.state.canvasWidth;
      this.canvasContext.canvas.height = this.state.canvasHeight;

      this._drawWaveForm();
    })
  }

  render() {
    return (
      <div ref={(container) => { this.container = container; }}>
        <div className={styles.label}>
          {/* <div className={styles.retryButton} onClick={this._clickedRetry}>Try another recording</div> */}
          {
            this.props.objectUrl && 
            (
              <div>
                <div className={styles.playButton}>
                  <ReactAudioPlayer src={this.props.objectUrl} controls />
                </div>
                {this._renderClippingInputs()}
                <div className={styles.saveButton} onClick={this._clickUseThisSelection}>Use this selection</div>
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