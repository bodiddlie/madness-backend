const jwt = require('jsonwebtoken');
const { unauthorized } = require('./response');
const { getUserSession } = require('./fetch-user');

const addAuth = () => (handler) => async (event, context) => {
  try {
    const eventWithUser = await auth(event);
    const response = await handler(eventWithUser, context);
    return response;
  } catch (err) {
    console.error(`Error while authenticating user: ${err.message}`);
    return unauthorized();
  }
};

async function auth(event) {
  if (!event.headers.Authorization) {
    throw new Error('Authorization header missing.');
  }

  const token = event.headers.Authorization.split(' ')[1];

  if (!token) {
    throw new Error('Invalid Authorization header: missing bearer token');
  }

  const { email, sessionId } = jwt.verify(token, process.env.JWT_SECRET);

  const userSession = await getUserSession(email, sessionId);

  if (!userSession) {
    throw new Error('User session not found in database');
  }

  return { ...event, userEmail: email };
}

module.exports = addAuth;
