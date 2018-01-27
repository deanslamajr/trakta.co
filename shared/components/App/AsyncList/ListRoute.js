import React from 'react'
import Helmet from 'react-helmet'
import { compose } from 'redux'
import { connect } from 'react-redux'
import UpdatedIcon from 'react-icons/lib/md/update'
import Eye from 'react-icons/lib/md/remove-red-eye'
import PaperClip from 'react-icons/lib/md/attach-file'
import TimeAgo from 'react-timeago'

import withStyles from 'isomorphic-style-loader/lib/withStyles'

import config from '../../../../config'

import { fetchAll as fetchTraks } from '../../../actions/traklist'
import { reset as resetSampleLoaderState } from '../../../actions/samples'
import { reset as resetTrakState } from '../../../actions/trak'

import * as selectors from '../../../reducers'

import styles from './listRoute.css'

class ListRoute extends React.Component {
  constructor (props) {
    super(props)
    this._renderListItem = this._renderListItem.bind(this)
  }

  _navigateToTrak (name) {
    this.props.history.push(`/e/${name}`)
  }

  _renderListItem (trak) {
    return (
      <div
        className={styles.card}
        key={trak.id}
        onClick={this._navigateToTrak.bind(this, trak.name)}>
        <div className={styles.cardContainer}>
          <div className={styles.title}>
            { trak.name }
          </div>
          <div className={styles.lowerSection}>
            <div className={styles.statsContainer}>
              <div className={styles.playsContainer}>
                <Eye size={18} />
                <span>12</span>
              </div>
              <div className={styles.playsContainer}>
                <PaperClip size={18} />
                <span>{trak.contribution_count}</span>
              </div>
            </div>
            <div className={styles.update}>
              <TimeAgo date={trak.updated_at} />
            </div>
          </div>
        </div>
      </div>
    )
  }

  componentDidMount () {
    this.props.fetchTraks()
    this.props.resetSampleLoaderState()
    this.props.resetTrakState()
    this.props.addItemToNavBar(null, { type: 'ADD', cb: () => this.props.history.push(`/new`) })
  }

  render () {
    const { traks } = this.props
    const sortedTraks = traks.sort((a, b) => a.updated_at < b.updated_at)

    return (
      <div className={styles.container}>
        <Helmet>
          <title>{config('appTitle')}</title>
        </Helmet>

        <div className={styles.label}>
          { sortedTraks.map(this._renderListItem) }
        </div>

      </div>
    )
  }
}

const mapActionsToProps = {
  fetchTraks,
  resetSampleLoaderState,
  resetTrakState
}

function mapStateToProps (state) {
  return { traks: selectors.getTraks(state) }
}

export default compose(
  withStyles(styles),
  connect(mapStateToProps, mapActionsToProps)
)(ListRoute)

export { ListRoute }
