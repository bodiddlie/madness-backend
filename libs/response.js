function success(body) {
  return buildResponse(200, body);
}

function failure(body) {
  return buildResponse(500, body);
}

function unauthorized() {
  return buildResponse(401, { message: 'Unauthorized to access resource.' });
}

function buildResponse(statusCode, body) {
  return {
    statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify(body),
  };
}

module.exports = {
  success,
  failure,
  unauthorized,
};
