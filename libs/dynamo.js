const AWS = require('aws-sdk');

function call(action, params) {
  const dynamodb = new AWS.DynamoDB.DocumentClient();

  return dynamodb[action](params).promise();
}

module.exports = {
  call,
};
