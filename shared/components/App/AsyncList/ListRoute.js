import React from 'react'
import ReactDOM from 'react-dom'
import Helmet from 'react-helmet'
import { compose } from 'redux'
import { connect } from 'react-redux'
import moment from 'moment'
import axios from 'axios'

import withStyles from 'isomorphic-style-loader/lib/withStyles'

import ListItem from './ListItem'
import AudioPlayer from '../../../../client/components/AudioPlayer'
import { NavButton } from '../AsyncNavBar/AsyncNavBar'

import getColorFromString from '../../../lib/getColorFromString'

import config from '../../../../config'

import { fetchAll as fetchTraks } from '../../../actions/traklist'

import * as selectors from '../../../reducers'

import styles from './listRoute.css'

class ListRoute extends React.Component {
  constructor () {
    super()

    this.itemRefs = []

    this.state = {
      activePlayer: null,
      loading: false,
      playAnimation: null,
      selectedTrakId: null,
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

        const { getPlayerRenderer } = require('../../../../client/lib/PlayerRenderer')
        const PlayerRenderer = getPlayerRenderer()

        PlayerRenderer.createFullTrakPlayer(filename, trak.id, duration)
          .then(player => this.setState({
            activePlayer: player,
            playAnimation,
            loading: false,
            stopAnimation
          }))
      })
  }

  _setRef = (trakId, ref) => {
    this.itemRefs[trakId] = ref
  }

  componentDidMount () {
    if (!this.props.hasFetched) {
      this.props.fetchTraks()
    }
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

    const sortedTraks = this.props.traks.sort((a, b) => moment(a.last_contribution_date).isBefore(b.last_contribution_date)
      ? 1
      : -1
    )

    return (
      <div className={styles.container}>
        <Helmet>
          <title>{config('appTitle')}</title>
        </Helmet>

        {
          activePlayer && (
            <AudioPlayer
              incrementPlaysCount={shouldPlayerIncrementPlaysCount}
              playAnimation={this.state.playAnimation}
              player={activePlayer}
              stopAnimation={this.state.stopAnimation}
              trakName={trakName}
              buttonColor={trakColor}
            />
          )
        }

        <div className={styles.label}>
          {sortedTraks.map(trak => (
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
