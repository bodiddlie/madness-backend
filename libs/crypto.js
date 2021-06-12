const crypto = require('crypto');

const ALGORITHM = 'aes-256-ctr';
const SECRET = process.env.SECRET_KEY || '12345678901234567890123456789012';
const iv = crypto.randomBytes(16);

function encrypt(text) {
  const cipher = crypto.createCipheriv(ALGORITHM, SECRET, iv);
  const encryptedText = Buffer.concat([cipher.update(text), cipher.final()]);
  return `${iv.toString('hex')}:${encryptedText.toString('hex')}`;
}

function decrypt(value) {
  const [ivPart, encryptedPart] = value.split(':');
  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    SECRET,
    Buffer.from(ivPart, 'hex')
  );

  const decrpyted = Buffer.concat([
    decipher.update(Buffer.from(encryptedPart, 'hex')),
    decipher.final(),
  ]);

  return decrpyted.toString();
}

module.exports = { encrypt, decrypt };
