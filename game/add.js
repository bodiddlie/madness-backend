const dynamodb = require('../libs/dynamo');
const { success, failure, unauthorized } = require('../libs/response');
const auth = require('../libs/auth');

module.exports.add = async (event) => {
  const authHeader = event.headers.Authorization;
  const token = authHeader.split(' ')[1];

  if (!auth(token)) {
    return unauthorized();
  }

  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body);

  const params = {
    TableName: process.env.TABLE_NAME,
    Item: {
      // TODO: change to use logged in userid
      PK: 'user',
      SK: data.title,
      title: data.title,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  };

  try {
    await dynamodb.call('put', params);
    console.log('Success');
    return success(params.Item);
  } catch (err) {
    console.error(`Failure: ${err.message}`);
    return failure({ message: 'Error occurred while creating pain entry.' });
  }
};
