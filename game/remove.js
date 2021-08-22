const dynamodb = require('../libs/dynamo');
const { success, failure } = require('../libs/response');
const auth = require('../libs/auth');

module.exports.remove = auth()(async (event) => {
  const params = {
    TableName: process.env.TABLE_NAME,
    Key: {
      PK: `USER#${event.userEmail}`,
      SK: `GAME#${event.pathParameters.id}`,
    },
  };

  try {
    await dynamodb.call('delete', params);
    return success();
  } catch (err) {
    console.error(`Failure while deleting game id: ${event.pathParameters.id}`);
    return failure({
      message: 'Error occurred while deleting game from list.',
    });
  }
});
