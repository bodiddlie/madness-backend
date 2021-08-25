const { success, failure } = require('../libs/response');
const { encrypt } = require('../libs/crypto');
const aws = require('aws-sdk');

const ses = new aws.SES({ region: 'us-east-1' });

const linkExpirationTime = 1000 * 60 * 30;

const link = 'https://pileofshame.klepinger.dev';

module.exports.signup = async (event) => {
  const data = JSON.parse(event.body);
  const { email } = data;
  try {
    const expirationDateTime = new Date(
      Date.now() + linkExpirationTime
    ).toISOString();
    const stringToEncrypt = JSON.stringify([email, expirationDateTime]);
    const encryptedString = encrypt(stringToEncrypt);

    return sendEmail(encryptedString, email);
  } catch (err) {
    console.error(`Failed to create a magic link: ${err.message}`);
    return failure({ message: 'Error while creating magic link.' });
  }
};

async function sendEmail(magicLink, email) {
  const params = {
    Destination: {
      ToAddresses: [email],
    },
    Message: {
      Body: {
        Text: { Data: `Visit ${link}?magicLink=${magicLink} to login.` },
      },
      Subject: {
        Data: 'Magic Link Login for Focus Madness',
      },
    },
    Source: 'test@klepinger.dev',
  };

  try {
    await ses.sendEmail(params).promise();
    return success({});
  } catch (err) {
    console.error(`Failed to send email: ${err.message}`);
    return failure({ message: 'Error while sending email' });
  }
}
