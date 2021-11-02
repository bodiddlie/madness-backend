const { success, notFound } = require('../libs/response');
const auth = require('../libs/auth');
const { getUser } = require('../libs/fetch-user');

module.exports.profile = auth()(async (event) => {
  const user = await getUser(event.userEmail);

  if (!user) {
    return notFound();
  }
  return success({ email: event.userEmail, isSorted: user.isSorted });
});
