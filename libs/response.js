function success(body) {
  return buildResponse(200, body);
}

function failure(body) {
  return buildResponse(500, body);
}

function badRequest(message) {
  return buildResponse(400, { message });
}

function notFound() {
  return buildResponse(404, { message: 'Not found' });
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
  badRequest,
  notFound,
  failure,
  unauthorized,
};
