import crypto from 'crypto';

const password = 'masmifhda083';

const hash = crypto
  .createHash('sha256')
  .update(password)
  .digest('hex');

console.log(hash);

