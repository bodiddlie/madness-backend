const dynamodb = require('../libs/dynamo');
const { success, failure } = require('../libs/response');
const auth = require('../libs/auth');

module.exports.sort = auth()(async (event) => {
  let data = [];
  try {
    data = JSON.parse(event.body);
  } catch (err) {
    console.log(`Error while parsing body: ${err.message}`);
    return failure({ message: 'Error while parsing request body' });
  }

  const failedIds = [];

  for (const g of data.games) {
    const params = {
      TableName: process.env.TABLE_NAME,
      Key: {
        PK: `USER#${event.userEmail}`,
        SK: `GAME#${g.id}`,
      },
      UpdateExpression: 'SET sortOrder = :sortOrder',
      ExpressionAttributeValues: {
        ':sortOrder': g.sortOrder,
      },
      ReturnValues: 'ALL_NEW',
    };

    try {
      await dynamodb.call('update', params);
    } catch (err) {
      console.error(
        `Failure to update sort order for game: ${g.id}: ${err.message}`
      );
      failedIds.push(g.id);
    }
  }

  if (failedIds.length > 0) {
    return failure({
      message: `Error occurred while updating sort order for games ${failedIds.join(
        ','
      )}`,
    });
  }

  const profileParams = {
    TableName: process.env.TABLE_NAME,
    Key: {
      PK: `USER#${event.userEmail}`,
      SK: `PROFILE#${event.userEmail}`,
    },
    UpdateExpression: 'SET isSorted = :isSorted',
    ExpressionAttributeValues: {
      ':isSorted': true,
    },
  };

  try {
    await dynamodb.call('update', profileParams);
    return success();
  } catch (err) {
    console.error(`Failure to update profile to sorted: ${err.message}`);
    return failure({ message: 'Error while updating profile to sorted.' });
  }
});
