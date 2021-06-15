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

  const params = {
    TableName: process.env.TABLE_NAME,
    Item: {
      // TODO: change to use logged in userid
      PK: `USER#${userEmail}`,
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
});
