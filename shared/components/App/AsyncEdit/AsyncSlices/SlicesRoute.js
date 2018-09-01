import React from 'react'
import PropTypes from 'prop-types'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import Helmet from 'react-helmet'

import InstanceRectangles from '../../../../../client/components/InstanceRectangles'

import { NavButton } from '../../AsyncNavBar/AsyncNavBar'

import config from '../../../../../config'

import styles from './styles.css'

class SlicesRoute extends React.Component {
  static propTypes = {
    instances: PropTypes.array,
    fetchInstances: PropTypes.func,
    history: PropTypes.object,
    setEnterAction: PropTypes.func,
    setPlayerAnimations: PropTypes.func,
    shouldFetchInstances: PropTypes.bool,
    trakName: PropTypes.string
  }

  _navigateToList = () => {
    this.props.history.push('/')
  }

  _navigateToContribute = () => {
    // clear enter keypress binding
    this.props.setEnterAction()

    let urlWithoutTrailingSlash = this.props.match.url
    if (urlWithoutTrailingSlash.charAt(urlWithoutTrailingSlash.length - 1) === '/') {
      urlWithoutTrailingSlash = urlWithoutTrailingSlash.slice(0, -1)
    }

    this.props.history.push(`${urlWithoutTrailingSlash}/recorder`)
  }

  componentDidMount () {
    /** @case - url navigation without trakName in path */
    if (!this.props.trakName) {
      return this.props.history.push('/new')
    }

    if (this.props.shouldFetchInstances) {
      this.props.fetchInstances()
    }

    this.props.setEnterAction(this._navigateToContribute)
  }

  render () {
    return (
      <div className={styles.container}>
        <Helmet>
          <title>{`${this.props.trakName} - ${config('appTitle')}`}</title>
        </Helmet>
        <InstanceRectangles
          setPlayerAnimations={this.props.setPlayerAnimations}
          instances={this.props.instances}
        />
        <NavButton
          type={'BACK'}
          cb={this._navigateToList}
          position={'TOP_LEFT'}
        />
        <NavButton
          type={'ADD'}
          cb={this._navigateToContribute}
          position={'BOTTOM_RIGHT'}
        />
      </div>
    )
  }
}

export default withStyles(styles)(SlicesRoute)

export { SlicesRoute }
