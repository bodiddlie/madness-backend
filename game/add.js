const dynamodb = require('../libs/dynamo');
const { success, failure } = require('../libs/response');
const auth = require('../libs/auth');

module.exports.add = auth()(async (event) => {
  let data;
  const timestamp = new Date().getTime();
  try {
    data = JSON.parse(event.body);
  } catch (err) {
    console.log(`Error while parsing body: ${err.message}`);
    return failure({ message: 'Error while parsing request body.' });
  }
  const { userEmail } = event;

  const listLength = await getGameCount(userEmail);

  const params = {
    TableName: process.env.TABLE_NAME,
    Item: {
      PK: `USER#${userEmail}`,
      SK: `GAME#${data.id}`,
      id: data.id,
      createdAt: timestamp,
      updatedAt: timestamp,
      title: data.title,
      completed: false,
      sortOrder: listLength + 1,
      boxArt: data.boxArt,
      description: data.description,
    },
  };

  try {
    await dynamodb.call('put', params);
    console.log('Success');
    const { PK, SK, createdAt, updateAt, ...game } = params.Item;
    return success(game);
  } catch (err) {
    console.error(`Failure: ${err.message}`);
    return failure({ message: 'Error occurred while creating pain entry.' });
  }
});

async function getGameCount(email) {
  const params = {
    TableName: process.env.TABLE_NAME,
    KeyConditionExpression: 'PK = :userId and begins_with(SK, :game)',
    ExpressionAttributeValues: {
      ':userId': `USER#${email}`,
      ':game': 'GAME#',
    },
  };

  try {
    const result = await dynamodb.call('query', params);
    return result.Items.length;
  } catch (err) {
    console.error(`Error while querying for list length: ${err.message}`);
    return 0;
  }
}
