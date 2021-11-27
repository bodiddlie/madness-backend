const { success, unauthorized } = require('../libs/response');
const { getUser, saveUser, saveUserSession } = require('../libs/fetch-user');
const { decrypt } = require('../libs/crypto');
const jwt = require('jsonwebtoken');
const cuid = require('cuid');

const tokenExpirationTime = 60 * 60 * 24 * 30;

module.exports.login = async (event) => {
  const data = JSON.parse(event.body);
  const { magicLink } = data;

  let decryptedMagicLink;
  try {
    decryptedMagicLink = JSON.parse(decrypt(magicLink));
  } catch (error) {
    console.warn('Error decrypting magic link.');
    return unauthorized();
  }

  const [email, linkExpiration] = decryptedMagicLink;

  if (!email || !linkExpiration) {
    console.warn('Invalid magic link.');
    return unauthorized();
  }

  const linkExpirationDate = new Date(linkExpiration);
  if (Date.now() > linkExpirationDate.getTime()) {
    console.warn('Magic link expired.');
    return unauthorized();
  }

  const user = await getUser(email);

  if (!user) {
    await saveUser(email);
  }

  // generate jwt
  const sessionId = cuid();

  const tokenBody = {
    sessionId,
    email,
  };

  const token = jwt.sign(tokenBody, process.env.JWT_SECRET, {
    expiresIn: tokenExpirationTime,
  });

  await saveUserSession(email, sessionId);

  // return jwt
  return success({ email, token });
};
