/**
 * This mock simulates the movement of the windowStartTime
 * @todo have cookie-based-session own this
 */
const INITIAL_CURRENT_ENDTIME = 10;
const INITIAL_FARTHEST_TIME = 5;
const mockSession = {
  // 10 & 5 so that first request will initialize these to 10 & 10
  currentEndtime: INITIAL_CURRENT_ENDTIME,
  farthestTime: INITIAL_FARTHEST_TIME
};

/**
 * Handles processing the user's session and figuring the user's next windowEndtime
 * @todo protect this endpoint so that users can't hit this manually to jump ahead
 * e.g. has to have contributted and received a valid code, this handler verifies this code is real
 */
function getNextWindowEndTime(req, res) {
  const nextEndTime = processNext(mockSession);
  res.json({ nextEndTime });
}

const ORIGIN_END_TIME = 10;
const ROUND_PROGRESS_LENGTH = 5;

function processNext(session) {
  if (session.currentEndtime > session.farthestTime) {
    session.farthestTime = session.currentEndtime;
    session.currentEndtime = ORIGIN_END_TIME;
  }
  else {
    session.currentEndtime += ROUND_PROGRESS_LENGTH;
  }

  return session.currentEndtime;
}

/**
 * Resets the mock session
 * this if for testing only
 * @todo remove this after sessions are properly implemented
 */
function resetSession(req, res) {
  mockSession.currentEndtime = INITIAL_CURRENT_ENDTIME;
  mockSession.farthestTime = INITIAL_FARTHEST_TIME;
  res.redirect('/');
}

export default getNextWindowEndTime

export {
  getNextWindowEndTime,
  resetSession,
  processNext,
  ORIGIN_END_TIME,
  ROUND_PROGRESS_LENGTH
};