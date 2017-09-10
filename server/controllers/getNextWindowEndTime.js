/**
 * This mock simulates the movement of the windowStartTime
 * @todo have cookie-based-session own this
 */
const mockSession = {
  currentEndtime: 10,
  farthestTime: 0
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

export default getNextWindowEndTime

export { 
  processNext,
  ORIGIN_END_TIME,
  ROUND_PROGRESS_LENGTH
};