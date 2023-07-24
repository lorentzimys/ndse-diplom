import crypto from 'crypto';

export function calcHashForArray(arr) {
  const hash = crypto.createHash('sha256');
  
  arr.sort().forEach(user => hash.update(user));

  return hash.digest('hex');
}