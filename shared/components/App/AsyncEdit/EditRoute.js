import React from 'react'
import Switch from 'react-router-dom/Switch'
import Route from 'react-router-dom/Route'
import Redirect from 'react-router/Redirect'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import axios from 'axios'
import KeyHandler from 'react-key-handler'

import Sequencer from './AsyncSequencer'
import Cleanup from './AsyncCleanup'
import Recorder from './AsyncRecorder'
import Slices from './AsyncSlices'
import ProgressRing from '../AsyncProgressRing'
import AudioPlayer from '../../../../client/components/AudioPlayer'

import styles from './styles.css'

const initialLeftSliderValue = 0.2
const initialRightSliderValue = 0.8

const initializedSequencerItems = {
  0: true
}
const initializedEffects = []

const initialCleanupState = {
  leftSliderValue: 0,
  rightSliderValue: 1,
  panning: 0,
  volume: 0,
  sourceDuration: 0
}

class EditRoute extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      activePlayer: null,

      instances: [],

      cleanupState: initialCleanupState,

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

      selectedSequencerItems: initializedSequencerItems,
      sequencerPlayer: null,

      showNavbarItems: true,

      playAnimation: undefined,
      stopAnimation: undefined,

      effects: initializedEffects,

      enterAction: () => {},
      spaceAction: () => {}
    }
  }

  _fetchInstances = () => {
    this._addSpinnerTask()

    axios.get(`/api/sample-instances/${this.state.trakName}`)
      .then(({ data: instances }) => {
        if (!instances.length) {
          return
        }

        this.setState({ instances })
        this._addSpinnerTask(instances.length * 2) /** x2 to account for the rendering task taking ~50% of the total time */
        this._completeSpinnerTask()

        const { getPlayerRenderer } = require('../../../../client/lib/PlayerRenderer')
        const PlayerRenderer = getPlayerRenderer()

        return PlayerRenderer.createCurrentTrakPlayer(instances, this._completeSpinnerTask)
          .then(currentTrakPlayer => {
            this.setState({
              currentTrakPlayer,
              activePlayer: currentTrakPlayer,
              shouldFetchInstances: false,
              shouldPlayerIncrementPlaysCount: true
            })
          })
      })
  }

  _setPlayerAnimations = (playAnimation, stopAnimation) => {
    this.setState({
      playAnimation,
      stopAnimation
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
    const initialCleanupState = {
      leftSliderValue: initialLeftSliderValue,
      rightSliderValue: initialRightSliderValue,
      sourceDuration: buffer.get().duration
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

  _createPlayerFromCleanup = (change, animations = {}) => {
    this._addSpinnerTask(2, true)

    this.setState(({ cleanupState: prevCleanupState }) => {
      const newCleanupState = Object.assign({}, prevCleanupState, change)
      return { cleanupState: newCleanupState }
    }, () => {
      const { getPlayerRenderer } = require('../../../../client/lib/PlayerRenderer')
      const PlayerRenderer = getPlayerRenderer()

      PlayerRenderer.createPlayerFromCleanup(this.state.sourceBuffer, this.state.cleanupState, this._completeSpinnerTask, this.state.effects)
        .then(cleanupPlayer => {
          this._completeSpinnerTask()

          this.setState({
            activePlayer: cleanupPlayer,
            cleanupPlayer,
            shouldPlayerIncrementPlaysCount: false,
            ...animations
          })
        })
    })
  }

  _createPlayerFromCleanupWithEffect = (effect, newIsActive = true) => {
    this._addSpinnerTask(2, true)

    this.setState(({ effects: prevEffects }) => {
      // copy current effects
      const updatedEffects = Array.from(prevEffects)
      // inactivate current active effect
      const currentActiveEffect = updatedEffects.find(({ isActive }) => isActive)
      if (currentActiveEffect) {
        currentActiveEffect.isActive = false
      }
      // check if new effect already exists in current effects
      const effectToUpdate = updatedEffects.find(({ type }) => type === effect.type)

      if (effectToUpdate) {
        // set this effect to active
        // update the values of this effect
        Object.assign(effectToUpdate, effect, { isActive: newIsActive })
      } else {
        // set new effect to active
        effect.isActive = true
        // add new effect to current effects
        updatedEffects.push(effect)
      }

      return { effects: updatedEffects }
    }, () => {
      const { getPlayerRenderer } = require('../../../../client/lib/PlayerRenderer')
      const PlayerRenderer = getPlayerRenderer()

      PlayerRenderer.createPlayerFromCleanup(this.state.sourceBuffer, this.state.cleanupState, this._completeSpinnerTask, this.state.effects)
        .then(cleanupPlayer => {
          this._completeSpinnerTask()

          this.setState({
            activePlayer: cleanupPlayer,
            cleanupPlayer,
            shouldPlayerIncrementPlaysCount: false
          })
        })
    })
  }

  _createPlayerFromSequencer = () => {
    const spinnerTasksCount = 2 + this.state.instances.length
    this._addSpinnerTask(spinnerTasksCount, true)

    const { getPlayerRenderer } = require('../../../../client/lib/PlayerRenderer')
    const PlayerRenderer = getPlayerRenderer()

    PlayerRenderer.createPlayerFromSequencer(
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

  _setEnterAction = (fn = () => {}) => {
    this.setState({ enterAction: fn })
  }

  _setSpaceAction = (fn) => {
    this.setState({ spaceAction: fn })
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
      enterAction: () => {},
      showNavbarItems: false
    }, () => {
      this._addSpinnerTask(4, true)
      const sampleBlob = this._getBlobFromBuffer(this.state.cleanupPlayer.buffer.get())

      this._completeSpinnerTask()

      const sampleDuration = this.state.cleanupPlayer.buffer.get().duration
      const trakDuration = this.state.sequencerPlayer.buffer.get().duration
      const sequencerCsv = Object.keys(this.state.selectedSequencerItems)
        .filter(item => this.state.selectedSequencerItems[item])
        .join(',')
      const queryString = `?trakName=${this.state.trakName}&sampleDuration=${sampleDuration}&sequencerCsv=${sequencerCsv}&trakDuration=${trakDuration}`

      return axios.post(`/api/sample${queryString}`, sampleBlob)
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

          // create new trak blob
          const trakBlob = this._getBlobFromBuffer(this.state.sequencerPlayer.buffer.get())
          return axios.post(`/api/version/${versionId}`, trakBlob)
        })
        .then(() => {
          this._completeSpinnerTask()
          /**
           * Mp3 Encoding results in Tone.Transport being unresponsive for an amount of time
           * proportional to the length of Mp3 encoding
           *
           * Consequently, don't proceed until Tone.Transport is responsive once again
           */
          const Tone = require('tone')

          return new Promise(resolve => {
            Tone.Transport.cancel()
            Tone.Transport.loop = true
            Tone.Transport.setLoopPoints(0, 0.5)

            Tone.Transport.schedule((time) => {
              Tone.Transport.stop()
              Tone.Transport.cancel()

              resolve()
            }, 0)

            Tone.Transport.start()
          })
        })
        .then(() => {
          this._completeSpinnerTask()
          /** initialize editor */
          this.setState({
            cleanupState: initialCleanupState,
            effects: initializedEffects,
            selectedSequencerItems: initializedSequencerItems,
            showNavbarItems: true
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
        {/* Hot Keys */}
        <KeyHandler
          code='Space'
          onKeyHandle={this.state.spaceAction}
        />
        <KeyHandler
          code='Enter'
          onKeyHandle={this.state.enterAction}
        />

        <Switch>
          <Redirect exact from='/e/new' to='/e/new/recorder' />
          <Route exact path={this.props.match.url} render={props => (
            <Slices
              {...props}
              instances={this.state.instances}
              fetchInstances={this._fetchInstances}
              setEnterAction={this._setEnterAction}
              setPlayerAnimations={this._setPlayerAnimations}
              shouldFetchInstances={this.state.shouldFetchInstances}
              trakName={this.state.trakName}
            />
          )} />
          <Route path={`${this.props.match.url}/recorder`} render={props => (
            <Recorder
              {...props}
              fetchInstances={this._fetchInstances}
              setCleanupState={this._setCleanupState}
              setEnterAction={this._setEnterAction}
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
                  createPlayerFromCleanupWithEffect={this._createPlayerFromCleanupWithEffect}
                  effects={this.state.effects}
                  setCleanupState={this._setCleanupState}
                  setEnterAction={this._setEnterAction}
                  setPlayerAnimations={this._setPlayerAnimations}
                  trakName={this.state.trakName}
                />
              )} />,
              <Route key={1} path={`${this.props.match.url}/sequencer`} render={props => (
                <Sequencer
                  {...props}
                  cleanupBuffer={this.state.cleanupPlayer.buffer}
                  createPlayerFromSequencer={this._createPlayerFromSequencer}
                  createPlayerFromSequencerItemSelect={this._createPlayerFromSequencerItemSelect}
                  instances={this.state.instances}
                  saveRecording={this._saveRecording}
                  selectedSequencerItems={this.state.selectedSequencerItems}
                  setEnterAction={this._setEnterAction}
                  setPlayerAnimations={this._setPlayerAnimations}
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
            <AudioPlayer
              incrementPlaysCount={this.state.shouldPlayerIncrementPlaysCount}
              playAnimation={this.state.playAnimation}
              setSpaceAction={this._setSpaceAction}
              stopAnimation={this.state.stopAnimation}
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
