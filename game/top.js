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
    const sorted = result.Items.sort((a, b) => a.sortOrder - b.sortOrder);
    const top = sorted[0];
    if (!top) {
      try {
        await updateProfile(event.userEmail);
      } catch (err) {
        console.error('Error while updating profile to unsorted');
        return failure({ message: 'Error while updating profile to unsorted' });
      }
    }
    return success(result.Items.sort((a, b) => a.sortOrder - b.sortOrder)[0]);
  } catch (err) {
    console.error(`Error while querying for top game: ${err.message}`);
    return failure({ message: 'Error while querying top game.' });
  }
});

async function updateProfile(email) {
  const params = {
    TableName: process.env.TABLE_NAME,
    Key: {
      PK: `USER#${email}`,
      SK: `PROFILE#${email}`,
    },
    UpdateExpression: 'SET isSorted = :isSorted',
    ExpressionAttributeValues: {
      ':isSorted': false,
    },
  };
  await dynamodb.call('update', params);
}
