import React from 'react'
import PlayIcon from 'react-icons/lib/md/play-arrow'
import ClockIcon from 'react-icons/lib/md/access-time'
import MusicNote from 'react-icons/lib/md/music-note'
import TimeAgo from 'react-timeago'
import formatDuration from 'format-duration'
import withStyles from 'isomorphic-style-loader/lib/withStyles'

import styles from './listItem.css'

function formatTime (seconds) {
  const milliseconds = seconds * 1000
  return formatDuration(milliseconds)
}

function renderLastUpdated (time) {
  return time
  ? (
    <div className={styles.update}>
      Last updated <TimeAgo date={time} />
    </div>
  )
  : null
}

function ListItem ({ trak, handleClick }) {
  const formattedTime = formatTime(trak.duration)

  return (
    <div
      className={styles.card}
      onClick={() => handleClick(trak.name)}
    >
      <div className={styles.cardContainer}>
        <div className={styles.title}>
          <div className={styles.leftArea}>
            { trak.name }
            { renderLastUpdated(trak.last_contribution_date)}
          </div>

          <div className={styles.statsContainer}>
            <div className={styles.playsContainer}>
              <PlayIcon size={18} />
              <span className={styles.datum}>{trak.plays_count}</span>
            </div>
            <div className={styles.playsContainer}>
              <MusicNote size={18} />
              <span className={styles.datum}>{trak.contribution_count}</span>
            </div>
            <div className={styles.playsContainer}>
              <ClockIcon size={18} />
              <span className={styles.datum}>{formattedTime}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default withStyles(styles)(ListItem)
