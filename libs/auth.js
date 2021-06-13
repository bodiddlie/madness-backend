const jwt = require('jsonwebtoken');
const { getUserSession } = require('./fetch-user');

function auth(token) {
  try {
    const { sessionId, email } = jwt.verify(token, process.env.JWT_SECRET);
    const session = getUserSession(email, sessionId);
    return Boolean(session);
  } catch (err) {
    console.error(`Error while validating JWT: ${err.message}`);
    return false;
  }
}

module.exports = auth;
