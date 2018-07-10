import React from 'react'
import PropTypes from 'prop-types'
import withStyles from 'isomorphic-style-loader/lib/withStyles'

import SampleInstances from '../../../../../client/components/SampleInstances'

import { renderButton } from '../../AsyncNavBar/AsyncNavBar'

import styles from './styles.css'

class SlicesRoute extends React.Component {
  static propTypes = {
    fetchInstances: PropTypes.func,
    history: PropTypes.object,
    shouldFetchInstances: PropTypes.bool,
    trakName: PropTypes.string,
  }

  _navigateToList = () => {
    this.props.history.push('/')
  }

  _navigateToContribute = () => {
    let urlWithoutTrailingSlash = this.props.match.url
    if (urlWithoutTrailingSlash.charAt(urlWithoutTrailingSlash.length - 1) === '/') {
      urlWithoutTrailingSlash = urlWithoutTrailingSlash.slice(0, -1)
    }

    this.props.history.push(`${urlWithoutTrailingSlash}/recorder`)
  }

  _renderBackButton = () => {
    const config = {
      cb: this._navigateToList,
      type: 'BACK',
    }
    return renderButton('TOP_LEFT', config)
  }
  
  _renderContributeButton = () => {
    const config = {
      cb: this._navigateToContribute,
      type: 'ADD',
    }
    return renderButton('BOTTOM_RIGHT', config)
  }

  componentDidMount () {
    /** @case - url navigation without trakName in path */
    if (!this.props.trakName) {
      return this.props.history.push('/new')
    }

    if (this.props.shouldFetchInstances) {
      this.props.fetchInstances()
    }
  }

  render () {
    return (
      <div className={styles.container}>
        <SampleInstances />
        { this._renderBackButton() }
        { this._renderContributeButton() }
      </div>
    )
  }
}

export default withStyles(styles)(SlicesRoute)

export { SlicesRoute }
