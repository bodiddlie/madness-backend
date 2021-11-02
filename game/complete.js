const dynamodb = require('../libs/dynamo');
const { success, failure } = require('../libs/response');
const auth = require('../libs/auth');

module.exports.complete = auth()(async (event) => {
  const params = {
    TableName: process.env.TABLE_NAME,
    Key: {
      PK: `USER#${event.userEmail}`,
      SK: `GAME#${event.pathParameters.id}`,
    },
    UpdateExpression: 'SET completed = :completed',
    ExpressionAttributeValues: {
      ':completed': true,
    },
    ReturnValues: 'ALL_NEW',
  };

  try {
    await dynamodb.call('update', params);
    return success();
  } catch (err) {
    console.error(
      `Failure while completing game ${event.pathParameters.id}: ${err}`,
    );
    return failure({ message: 'Error occurred while completing game.' });
  }
});
