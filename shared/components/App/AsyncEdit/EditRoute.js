import React from 'react'
import Switch from 'react-router-dom/Switch'
import Route from 'react-router-dom/Route'
import Redirect from 'react-router/Redirect'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import axios from 'axios'

import Sequencer from './AsyncSequencer'
import Cleanup from './AsyncCleanup'
import Recorder from './AsyncRecorder'
import Slices from './AsyncSlices'
import ProgressRing from '../AsyncProgressRing'
import InstancePlaylist from '../../../../client/components/InstancePlaylist'

import styles from './styles.css'

const initialLeftSliderValue = 0.2
const initialRightSliderValue = 0.8

class EditRoute extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      activePlayer: null,

      instances: [],

      cleanupState: {
        leftSliderValue: 0,
        rightSliderValue: 1,

        loopCount: 0,
        loopPadding: 0,
        panning: 0,
        volume: 0,

        clipDuration: 0,
        sourceDuration: 0
      },

      currentTrakPlayer: null,
      cleanupPlayer: null,

      trakName: this.props.match.url.split('/')[2],
      shouldFetchInstances: true,
      shouldPlayerIncrementPlaysCount: true,
      spinnerTasks: {
        count: 0,
        completedCount: 0
      },
      sourceBuffer: null,

      selectedSequencerItems: {},
      sequencerPlayer: null,

      showNavbarItems: true
    }
  }

  _fetchInstances = () => {
    this._addSpinnerTask()
    axios.get(`/api/sample-instances/${this.state.trakName}`)
      .then(({ data: instances }) => {
        this.setState({ instances })
        this._addSpinnerTask(instances.length * 2) /** x2 to account for the rendering task taking ~50% of the total time */
        this._completeSpinnerTask()

        const { getPlaylistRenderer } = require('../../../../client/lib/PlaylistRenderer')
        const PlaylistRenderer = getPlaylistRenderer()

        return PlaylistRenderer.createCurrentTrakPlayer(instances, this._completeSpinnerTask)
      })
      .then(currentTrakPlayer => {
        this.setState({
          currentTrakPlayer,
          activePlayer: currentTrakPlayer,
          shouldFetchInstances: false,
          shouldPlayerIncrementPlaysCount: true
        })
      })
  }

  _renderLoadingComponent = (progress) => {
    return (
      <div className={styles.spinner}>
        <ProgressRing radius={50} stroke={2} progress={progress} />
      </div>
    )
  }

  _addSpinnerTask = (count = 1, reset = false) => {
    this.setState(({ spinnerTasks: previousSpinnerTasks }) => {
      const updatedSpinnerTasks = Object.assign({}, previousSpinnerTasks, {
        count: reset
          ? count
          : previousSpinnerTasks.count + count,
        completedCount: reset
          ? 0
          : previousSpinnerTasks.completedCount
      })

      return { spinnerTasks: updatedSpinnerTasks }
    })
  }

  _completeSpinnerTask = (count = 1) => {
    this.setState(({ spinnerTasks: previousSpinnerTasks }) => {
      const updatedSpinnerTasks = Object.assign({}, previousSpinnerTasks, {
        completedCount: previousSpinnerTasks.completedCount + count
      })

      return { spinnerTasks: updatedSpinnerTasks }
    })
  }

  _setShouldFetchInstances = (shouldFetchInstances) => {
    this.setState({ shouldFetchInstances })
  }

  _setSourceBuffer = (buffer) => {
    const sourceDuration = buffer.get().duration

    const startTime = sourceDuration * initialLeftSliderValue
    const endTime = sourceDuration * initialRightSliderValue
    const clipDuration = endTime - startTime

    const initialCleanupState = {
      leftSliderValue: initialLeftSliderValue,
      rightSliderValue: initialRightSliderValue,
      loopPadding: clipDuration,
      clipDuration,
      sourceDuration
    }

    this.setState(({ cleanupState: prevCleanupState }) => {
      const newCleanupState = Object.assign({}, prevCleanupState, initialCleanupState)

      return {
        sourceBuffer: buffer,
        cleanupState: newCleanupState
      }
    })
  }

  _setCleanupState = (cleanupState) => {
    this.setState(({ cleanupState: prevCleanupState }) => {
      const newCleanupState = Object.assign({}, prevCleanupState, cleanupState)
      return { cleanupState: newCleanupState }
    })
  }

  _createPlayerFromCleanup = (change) => {
    this._addSpinnerTask(2, true)
    this.setState(({ cleanupState: prevCleanupState }) => {
      const newCleanupState = Object.assign({}, prevCleanupState, change)
      return { cleanupState: newCleanupState }
    }, () => {
      const { getPlaylistRenderer } = require('../../../../client/lib/PlaylistRenderer')
      const PlaylistRenderer = getPlaylistRenderer()

      PlaylistRenderer.createPlayerFromCleanup(this.state.sourceBuffer, this.state.cleanupState, this._completeSpinnerTask)
        .then(cleanupPlayer => {
          this._completeSpinnerTask()

          this.setState(({ cleanupState: prevCleanupState }) => {
            const startTime = prevCleanupState.sourceDuration * prevCleanupState.leftSliderValue
            const endTime = prevCleanupState.sourceDuration * prevCleanupState.rightSliderValue
            const clipDuration = endTime - startTime

            const newCleanupState = Object.assign({}, prevCleanupState, { clipDuration })

            return {
              activePlayer: cleanupPlayer,
              cleanupPlayer,
              shouldPlayerIncrementPlaysCount: false,
              cleanupState: newCleanupState
            }
          })
        })
    })
  }

  _createPlayerFromSequencer = () => {
    const spinnerTasksCount = 2 + this.state.instances.length
    this._addSpinnerTask(spinnerTasksCount, true)
    const { getPlaylistRenderer } = require('../../../../client/lib/PlaylistRenderer')
    const PlaylistRenderer = getPlaylistRenderer()

    PlaylistRenderer.createPlayerFromSequencer(
      this.state.selectedSequencerItems,
      this.state.cleanupPlayer.buffer,
      this.state.cleanupState,
      this.state.instances,
      this._completeSpinnerTask
    )
    .then(sequencerPlayer => {
      this._completeSpinnerTask()
      this.setState({
        activePlayer: sequencerPlayer,
        sequencerPlayer,
        shouldPlayerIncrementPlaysCount: false
      })
    })
  }

  _createPlayerFromSequencerItemSelect = (selectedItem) => {
    this.setState(({ selectedSequencerItems: prevSelectedSequencerItems }) => {
      const currentSelectedState = Object.assign({}, prevSelectedSequencerItems)
      currentSelectedState[selectedItem] = Boolean(!currentSelectedState[selectedItem])
      return { selectedSequencerItems: currentSelectedState }
    }, this._createPlayerFromSequencer)
  }

  _clearActivePlayer = () => {
    this.setState({
      activePlayer: null,
      cleanupPlayer: null
    })
  }

  _getBlobFromBuffer = (buffer) => {
    const { getTrakRenderer } = require('../../../../client/lib/TrakRenderer')
    const TrakRenderer = getTrakRenderer()
    return TrakRenderer.getBlobFromBuffer(buffer)
  }

  _setTrakName = (trakName) => {
    this.setState({ trakName })
  }

  _saveRecording = (event) => {
    // prevent page refresh
    event.preventDefault()

    /** Disable NavBar Items and all other user interactivity */
    this.setState({
      activePlayer: null,
      showNavbarItems: false
    }, () => {
      this._addSpinnerTask(4, true)
      this._getBlobFromBuffer(this.state.cleanupPlayer.buffer.get())
        .then(blob => {
          this._completeSpinnerTask()

          const sampleDuration = this.state.cleanupPlayer.buffer.get().duration
          const trakDuration = this.state.sequencerPlayer.buffer.get().duration
          const sequencerCsv = Object.keys(this.state.selectedSequencerItems)
            .filter(item => this.state.selectedSequencerItems[item])
            .join(',')
          const queryString = `?trakName=${this.state.trakName}&sampleDuration=${sampleDuration}&sequencerCsv=${sequencerCsv}&trakDuration=${trakDuration}`

          return axios.post(`/api/sample${queryString}`, blob)
        })
        .then(({ data }) => {
          const {
            trakName,
            versionId
          } = data

          this._completeSpinnerTask()

          this._setShouldFetchInstances(true)

          const isANewTrak = trakName !== this.state.trakName
          if (trakName && isANewTrak) {
            this._setTrakName(trakName)
          }

          // get new trak blob
          return this._getBlobFromBuffer(this.state.sequencerPlayer.buffer.get())
            .then(blob => {
              this._completeSpinnerTask()
              return axios.post(`/api/version/${versionId}`, blob)
            })
        })
        .then(() => {
          this._completeSpinnerTask()
          this.setState({
            showNavbarItems: true,
            selectedSequencerItems: {}
          })
          this.props.history.push(`/e/${this.state.trakName}`)
        })
        .catch((err) => {
          // @todo log error
          // @todo handle this gracefully
          console.error(err)
          // this.props.failureCB
        })
    })
  }

  render () {
    const {
      spinnerTasks
    } = this.state

    const loadingProgress = spinnerTasks.count
      ? spinnerTasks.completedCount / spinnerTasks.count
      : 0
    const showLoadSpinner = loadingProgress > 0 && loadingProgress < 1

    return (
      <div className={styles.container}>
        <Switch>
          <Redirect exact from='/e/new' to='/e/new/recorder' />
          <Route exact path={this.props.match.url} render={props => (
            <Slices
              {...props}
              instances={this.state.instances}
              fetchInstances={this._fetchInstances}
              shouldFetchInstances={this.state.shouldFetchInstances}
              trakName={this.state.trakName}
            />
          )} />
          <Route path={`${this.props.match.url}/recorder`} render={props => (
            <Recorder
              {...props}
              fetchInstances={this._fetchInstances}
              setCleanupState={this._setCleanupState}
              setSourceBuffer={this._setSourceBuffer}
              shouldFetchInstances={this.state.shouldFetchInstances}
              trakName={this.state.trakName}
            />
          )} />
          {
            this.state.cleanupState.sourceDuration && ([
              <Route key={0} path={`${this.props.match.url}/cleanup`} render={props => (
                <Cleanup
                  {...props}
                  cleanupState={this.state.cleanupState}
                  clearActivePlayer={this._clearActivePlayer}
                  createPlayerFromCleanup={this._createPlayerFromCleanup}
                  setCleanupState={this._setCleanupState}
                  trakName={this.state.trakName}
                />
              )} />,
              <Route key={1} path={`${this.props.match.url}/sequencer`} render={props => (
                <Sequencer
                  {...props}
                  createPlayerFromSequencer={this._createPlayerFromSequencer}
                  createPlayerFromSequencerItemSelect={this._createPlayerFromSequencerItemSelect}
                  instances={this.state.instances}
                  saveRecording={this._saveRecording}
                  selectedSequencerItems={this.state.selectedSequencerItems}
                  showNavbarItems={this.state.showNavbarItems}
                  trakName={this.state.trakName}
                />
              )} />
            ])
          }
          <Redirect to={{ pathname: this.props.match.url }} />
        </Switch>

        {
          this.state.activePlayer && (
            <InstancePlaylist
              incrementPlaysCount={this.state.shouldPlayerIncrementPlaysCount}
              player={this.state.activePlayer}
              trakName={this.state.trakName}
            />
          )
        }
        {
          showLoadSpinner && this._renderLoadingComponent(loadingProgress)
        }
      </div>
    )
  }
}

export { EditRoute }

export default withStyles(styles)(EditRoute)
