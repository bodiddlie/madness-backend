const dynamodb = require('../libs/dynamo');
const { success, failure } = require('../libs/response');
const auth = require('../libs/auth');

module.exports.top = auth()(async (event) => {
  const params = {
    TableName: process.env.TABLE_NAME,
    KeyConditionExpression: 'PK = :userId and begins_with(SK, :game)',
    FilterExpression: 'completed = :completed',
    ExpressionAttributeValues: {
      ':userId': `USER#${event.userEmail}`,
      ':game': 'GAME#',
      ':completed': false,
    },
  };

  try {
    const result = await dynamodb.call('query', params);
    const array = [...result.Items];
    console.log(array);
    array.sort((a, b) => a.sortOrder - b.sortOrder);
    console.log(array);
    return success(array[0]);
  } catch (err) {
    console.error(`Error while querying for top game: ${err.message}`);
    return failure({ message: 'Error while querying top game.' });
  }
});
