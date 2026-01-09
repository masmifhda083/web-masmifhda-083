import crypto from 'crypto';

const password = 'ppdbAdmin2026';

const hash = crypto
  .createHash('sha256')
  .update(password)
  .digest('hex');

console.log(hash);

