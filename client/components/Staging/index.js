import React from 'react'
import PropTypes from 'prop-types'
import withStyles from 'isomorphic-style-loader/lib/withStyles'
import { compose } from 'redux'
import { connect } from 'react-redux'
import axios from 'axios'
import classnames from 'classnames'
import Tone from 'tone'
import Helmet from 'react-helmet'

import Sequencer from './Sequencer'
import { NavButton } from '../../../shared/components/App/AsyncNavBar/AsyncNavBar'

import { getTrakRenderer } from '../../lib/TrakRenderer'
import { getPlaylistRenderer } from '../../lib/PlaylistRenderer'

import * as selectors from '../../../shared/reducers'

import {
  setShouldFetchInstances,
  setName as setTrakName,
} from '../../../shared/actions/trak'

import config from '../../../config'

import styles from './staging.css'

function getMainEditUrl (url) {
  return url.replace('/staging', '')
}

class Staging extends React.Component {
  static propTypes = {
    history: PropTypes.object,
    createPlayerFromSequencer: PropTypes.func,
    createPlayerFromSequencerItemSelect: PropTypes.func,
    selectedSequencerItems: PropTypes.object,
    setCurrentPlayerActive: PropTypes.func,
    trakName: PropTypes.string
  }

  constructor (props) {
    super(props)

    this.trakRenderer = getTrakRenderer()
    this.playlistRenderer = getPlaylistRenderer()

    this.state = {
      selectedItems: {}
    }
  }

  _saveRecording = (event) => {
    // prevent page refresh
    event.preventDefault()

    const {
      buffer,
      selectedItems
    } = this.state

    const sampleDuration = buffer.get().duration

    this.props.addItemToNavBar(null)

    this.setState({
      isSaving: true, // show save animation
      buffer: undefined    // side effect: removes player
    },
    () => {
      const config = {
        onUploadProgress: (progressEvent) => {
          console.log(
            `upload progress: ${Math.round(progressEvent.loaded * 100 / progressEvent.total)}`
          )
        }
      }

      const trakName = this.props.trakName || this.props.match.url.split('/')[2]
      const sequencerCsv = Object.keys(selectedItems).filter(item => selectedItems[item]).join(',')

      // @todo pass along some kind of token (cookie?) that the backend can verify that this POST has authority to make an update
      // e.g. user is actually looking at the page and is not a robot
      const queryString = `?trakName=${trakName}&sampleDuration=${sampleDuration}&sequencerCsv=${sequencerCsv}&trakDuration=${this.playlistRenderer.getDuration()}`

      this._getBlobFromObjectUrl()
        .then((data) => axios.post(`/api/sample${queryString}`, data, config))
        .then(({ data }) => {
          const {
            trakName,
            versionId
          } = data

          this.props.setShouldFetchInstances(true)

          const isANewTrak = trakName !== this.props.trakName
          if (trakName && isANewTrak) {
            this.props.setTrakName(trakName)
          }

          // get new trak blob
          return this.trakRenderer.getBlobFromBuffer()
            .then(blob => {
              return axios.post(`/api/version/${versionId}`, blob, config)
            })
        })
        .then(() => {
          this.props.history.push(`/e/${this.props.trakName}`)
        })
        .catch((err) => {
          // @todo log error
          // @todo handle this gracefully
          console.error(err)
          // this.props.failureCB
        })
    })
  }

  /**
   * getting a blob from an objectUrl is tricky :)
   * this method contains the trick
   */
  _getBlobFromObjectUrl = () => {
    return axios.get(this.props.objectUrl, { responseType: 'blob' })
      .then(({ data }) => data)
  }

  componentDidMount () {
    this.props.createPlayerFromSequencer()
  }

  render () {
    const mainEditUrl = getMainEditUrl(this.props.match.url)

    return (
      <div>
        <Helmet>
          <title>{`${this.props.trakName} - staging - ${config('appTitle')}`}</title>
        </Helmet>

        <Sequencer
          onItemSelect={this.props.createPlayerFromSequencerItemSelect}
          selectedItems={this.props.selectedSequencerItems}
        />
        <NavButton
          type={'BACK'}
          cb={() => this.props.history.push(`${mainEditUrl}/cleanup`)}
          position={'TOP_LEFT'}
        />
        <NavButton
          type={'CHECK'}
          cb={this._saveRecording}
          position={'BOTTOM_RIGHT'}
        />
      </div>
    )
  }
}

const mapActionsToProps = {
  setTrakName,
  setShouldFetchInstances
}

function mapStateToProps (state) {
  return {
    objectUrl: selectors.getStagedObjectUrl(state)
  }
}

export { Staging }

export default compose(
  withStyles(styles),
  connect(mapStateToProps, mapActionsToProps)
)(Staging)
