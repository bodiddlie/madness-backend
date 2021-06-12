const { success, unauthorized } = require('../libs/response');
const dynamodb = require('../libs/dynamo');
const { decrypt } = require('../libs/crypto');
const jwt = require('jsonwebtoken');
const cuid = require('cuid');

const tokenExpirationTime = 60 * 60 * 24 * 30;

module.exports.login = async (event) => {
  try {
    const data = JSON.parse(event.body);
    const { magicLink } = data;
    console.log(magicLink);
    const decryptedMagicLink = JSON.parse(decrypt(magicLink));
    console.log(decryptedMagicLink);
    const [email, linkExpiration] = decryptedMagicLink;

    console.log(`Email: ${email}`);
    if (!email || !linkExpiration) {
      throw new Error('Invalid magic link.');
    }

    const linkExpirationDate = new Date(linkExpiration);
    if (Date.now() > linkExpirationDate.getTime()) {
      throw new Error('Magic link expired. Please request a new one.');
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
    return success({ token });
  } catch (err) {
    console.error(err.message);
    return unauthorized({ message: err.message });
  }
};

async function getUser(email) {
  const params = {
    TableName: process.env.TABLE_NAME,
    Key: {
      PK: `USER#${email}`,
      SK: `PROFILE#${email}`,
    },
  };

  try {
    const result = await dynamodb.call('get', params);
    return result.Item;
  } catch {
    return null;
  }
}

async function saveUser(email) {
  console.log(email);
  const timestamp = new Date().toISOString();
  const params = {
    TableName: process.env.TABLE_NAME,
    Item: {
      PK: `USER#${email}`,
      SK: `PROFILE#${email}`,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  };

  await dynamodb.call('put', params);
  return params.Item;
}

async function saveUserSession(email, sessionId) {
  const timestamp = new Date().toISOString();
  const params = {
    TableName: process.env.TABLE_NAME,
    Item: {
      PK: `USER#${email}`,
      SK: `SESSION#${sessionId}`,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  };

  await dynamodb.call('put', params);
  return;
}
