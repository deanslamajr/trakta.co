import React from 'react'
import ReactDOM from 'react-dom'
import Helmet from 'react-helmet'
import { compose } from 'redux'
import { connect } from 'react-redux'
import moment from 'moment'
import axios from 'axios'
import KeyHandler from 'react-key-handler'
import isequal from 'lodash.isequal'
import isIOS from 'is-ios'

import withStyles from 'isomorphic-style-loader/lib/withStyles'

import ListItem from './ListItem'
import AudioPlayer from '../../../../client/components/AudioPlayer'
import { NavButton } from '../AsyncNavBar/AsyncNavBar'

import getColorFromString from '../../../lib/getColorFromString'

import config from '../../../../config'

import { fetchAll as fetchTraks } from '../../../actions/traklist'

import * as selectors from '../../../reducers'

import styles from './listRoute.css'

function disableSpaceKeydownScrolling (e) {
  if (e.keyCode == 32) {
    e.preventDefault()
  }
}

function sortTraks (traks) {
  return traks.sort((a, b) => moment(a.last_contribution_date).isBefore(b.last_contribution_date)
    ? 1
    : -1
  )
}

class ListRoute extends React.Component {
  constructor () {
    super()

    this.itemRefs = []

    this.state = {
      activePlayer: null,
      enterAction: () => this._navigateToNew(),
      loading: false,
      playAnimation: null,
      selectedTrakId: null,
      sortedTraks: [],
      spaceAction: () => {},
      stopAnimation: null,
      viewedTraks: []
    }
  }

  _navigateToEdit = (trakName) => {
    this.props.history.push(`/e/${trakName}`)
  }

  _navigateToNew = () => {
    this.props.history.push(`/e/new/recorder`)
  }

  _handleTrakSelect = (trak, playAnimation, stopAnimation) => {
    const trakColor = getColorFromString(trak.name)

    const updatedViewedTraks = Array.from(this.state.viewedTraks)
    updatedViewedTraks.push(trak.id)

    this.setState({
      enterAction: () => this._navigateToEdit(trak.name),
      loading: true,
      selectedTrakId: trak.id,
      selectedTrakName: trak.name,
      viewedTraks: updatedViewedTraks,
      trakColor
    }, () => {
      const itemRef = ReactDOM.findDOMNode(this.itemRefs[trak.id])
      itemRef.scrollIntoView()
    })

    axios.get(`/api/trak/${trak.name}`)
      .then(({ data }) => {
        const { filename, duration } = data

        if (isIOS) {
          const baseTrakUrl = config('s3TrakBucket')
          const url = `${baseTrakUrl}/${filename}`

          const Tone = require('tone')

          new Tone.Player(url, (newTrakPlayer) => {
            this.setState({
              activePlayer: newTrakPlayer,
              playAnimation,
              loading: false,
              stopAnimation
            })
          }).toMaster()
        }
        else {
          const { getPlayerRenderer } = require('../../../../client/lib/PlayerRenderer')
          const PlayerRenderer = getPlayerRenderer()

          PlayerRenderer.createFullTrakPlayer(filename, trak.id, duration)
            .then(player => this.setState({
              activePlayer: player,
              playAnimation,
              loading: false,
              stopAnimation
            }))
        }
      })
  }

  _setRef = (trakId, ref) => {
    this.itemRefs[trakId] = ref
  }

  _setSpaceAction = (fn) => {
    this.setState({ spaceAction: fn })
  }

  componentWillReceiveProps (nextProps) {
    const traksHasChanged  = !isequal(this.props.traks, nextProps.traks)

    if (traksHasChanged) {
      const sortedTraks = sortTraks(nextProps.traks)

      this.setState({ sortedTraks })
    }
  }

  componentDidMount () {
    window.addEventListener('keydown', disableSpaceKeydownScrolling)

    if (!this.props.hasFetched) {
      this.props.fetchTraks()
    }

    const sortedTraks = sortTraks(this.props.traks)

    this.setState({ sortedTraks })
  }

  componentWillUnmount () {
    window.removeEventListener('keydown', disableSpaceKeydownScrolling)
  }

  render () {
    const {
      activePlayer,
      loading,
      selectedTrakId,
      selectedTrakName,
      shouldPlayerIncrementPlaysCount,
      trakColor,
      trakName,
      viewedTraks
    } = this.state

    return (
        <div className={styles.container}>
          <Helmet>
            <title>{config('appTitle')}</title>
          </Helmet>

          <KeyHandler
            code='Space'
            onKeyHandle={this.state.spaceAction}
          />
          <KeyHandler
            code='Enter'
            onKeyHandle={this.state.enterAction}
          />

          {
            activePlayer && (
              <AudioPlayer
                incrementPlaysCount={shouldPlayerIncrementPlaysCount}
                playAnimation={this.state.playAnimation}
                player={activePlayer}
                setSpaceAction={this._setSpaceAction}
                stopAnimation={this.state.stopAnimation}
                trakName={trakName}
                buttonColor={trakColor}
              />
            )
          }

          <div className={styles.label}>
            {this.state.sortedTraks.map(trak => (
              <ListItem
                key={trak.id}
                ref={this._setRef.bind(this, trak.id)}
                trak={trak}
                handleClick={this._handleTrakSelect}
                selectedTrakId={selectedTrakId}
                hasViewed={viewedTraks.includes(trak.id)}
              />
            ))}
          </div>

          <NavButton
            type={'REFRESH'}
            cb={this.props.fetchTraks}
            position={'BOTTOM_LEFT'}
          />
          <NavButton
            type={'ADD'}
            cb={this._navigateToNew}
            position={'BOTTOM_RIGHT'}
          />
          {
            selectedTrakName && (
              <React.Fragment>
                {
                  loading && (
                    <NavButton
                      type={'LOADING'}
                      color={trakColor}
                      position={'TOP_RIGHT'}
                    />
                  )
                }
                <NavButton
                  type={'EDIT'}
                  cb={() => this._navigateToEdit(selectedTrakName)}
                  color={trakColor}
                  position={'TOP_LEFT'}
                />
              </React.Fragment>
            )
          }
        </div>
    )
  }
}

const mapActionsToProps = {
  fetchTraks
}

function mapStateToProps (state) {
  return {
    hasFetched: selectors.hasFetched(state),
    traks: selectors.getTraks(state)
  }
}

export default compose(
  withStyles(styles),
  connect(mapStateToProps, mapActionsToProps)
)(ListRoute)

export { ListRoute }
