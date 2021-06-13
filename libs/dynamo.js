const AWS = require('aws-sdk');

function call(action, params) {
  const dynamodb = new AWS.DynamoDB.DocumentClient();

  return dynamodb[action](params).promise();
}

function buildParams() {
  const params = {
    TableName: process.env.TABLE_NAME,
  };
  return params;
}

module.exports = {
  call,
  buildParams,
};
