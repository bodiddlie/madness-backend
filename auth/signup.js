const { success, failure } = require('../libs/response');
const { encrypt } = require('../libs/crypto');
const aws = require('aws-sdk');

const ses = new aws.SES({ region: 'us-east-1' });

const linkExpirationTime = 1000 * 60 * 30;

module.exports.signup = async (event) => {
  const data = JSON.parse(event.body);
  const email = data.email.trim();
  try {
    const expirationDateTime = new Date(
      Date.now() + linkExpirationTime,
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
        Html: {
          Charset: 'UTF-8',
          Data: `<p>Hi ${email}! Here's the magic link you requested to access the Pile of Shame app.</p>
<p><a href="${process.env.ADDRESS}?magicLink=${magicLink}">Click here to login</a></p>
<p><i>You received this email because your email address was used to sign up for an account at <a href="${process.env.ADDRESS}">pileofhsame.klepinger.dev</a>. If you didn't sign up for an account, feel free to disregard and delete this email.</i></p>`,
        },
      },
      Subject: {
        Data: 'Magic Link Login for Pile of Shame',
      },
    },
    Source: 'noreply@klepinger.dev',
  };

  try {
    await ses.sendEmail(params).promise();
    return success({});
  } catch (err) {
    console.error(`Failed to send email: ${err.message}`);
    return failure({ message: 'Error while sending email' });
  }
}
