const dynamodb = require('./dynamo');

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
      isSorted: false,
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

async function getUserSession(email, sessionId) {
  const params = dynamodb.buildParams();
  params.Key = {
    PK: `USER#${email}`,
    SK: `SESSION#${sessionId}`,
  };

  try {
    const result = await dynamodb.call('get', params);
    return result.Item;
  } catch {
    return null;
  }
}

module.exports = {
  getUser,
  saveUser,
  saveUserSession,
  getUserSession,
};
