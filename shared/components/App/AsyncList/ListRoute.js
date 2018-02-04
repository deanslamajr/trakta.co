import React from 'react'
import Helmet from 'react-helmet'
import { compose } from 'redux'
import { connect } from 'react-redux'

import withStyles from 'isomorphic-style-loader/lib/withStyles'

import ListItem from './ListItem'

import config from '../../../../config'

import { fetchAll as fetchTraks } from '../../../actions/traklist'
import { reset as resetSampleLoaderState } from '../../../actions/samples'
import { reset as resetTrakState } from '../../../actions/trak'

import * as selectors from '../../../reducers'

import styles from './listRoute.css'

class ListRoute extends React.Component {
  constructor (props) {
    super(props)
    this._navigateToTrak = this._navigateToTrak.bind(this)
  }

  _navigateToTrak (name) {
    this.props.history.push(`/e/${name}`)
  }

  componentDidMount () {
    this.props.fetchTraks()
    this.props.resetSampleLoaderState()
    this.props.resetTrakState()
    this.props.addItemToNavBar(null, { type: 'ADD', cb: () => this.props.history.push(`/new`) })
  }

  render () {
    const { traks } = this.props
    const sortedTraks = traks.sort((a, b) => a.last_contribution_date < b.last_contribution_date)

    return (
      <div className={styles.container}>
        <Helmet>
          <title>{config('appTitle')}</title>
        </Helmet>

        <div className={styles.label}>
          {sortedTraks.map(trak => <ListItem key={trak.id} trak={trak} handleClick={this._navigateToTrak} />)}
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
