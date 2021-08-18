const dynamodb = require('../libs/dynamo');
const { success, failure } = require('../libs/response');
const auth = require('../libs/auth');

module.exports.get = auth()(async (event) => {
  const { userEmail } = event;

  const params = {
    TableName: process.env.TABLE_NAME,
    KeyConditionExpression: 'PK = :userId and begins_with(SK, :game)',
    ExpressionAttributeValues: {
      ':userId': `USER#${userEmail}`,
      ':game': 'GAME#',
    },
  };

  try {
    const result = await dynamodb.call('query', params);
    return success(result.Items);
  } catch (err) {
    console.error(`Error while querying for game list: ${err.message}`);
    return failure({ message: 'Error while querying for game list.' });
  }
});
