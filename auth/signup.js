const { success, failure } = require('../libs/response');
const { encrypt } = require('../libs/crypto');

const linkExpirationTime = 1000 * 60 * 3;

module.exports.signup = async (event) => {
  const data = JSON.parse(event.body);
  const { email } = data;
  try {
    const expirationDateTime = new Date(
      Date.now() + linkExpirationTime
    ).toISOString();
    const stringToEncrypt = JSON.stringify([email, expirationDateTime]);
    const encryptedString = encrypt(stringToEncrypt);

    return success({ magicLink: encryptedString });
  } catch (err) {
    console.error(`Failed to create a magic link: ${err.message}`);
    return failure({ message: 'Error while creating magic link.' });
  }
};
