import { secp256k1 } from '@noble/curves/secp256k1.js';
import { keccak_256 } from '@noble/hashes/sha3.js';

// The test signature from ecrecover.spec.ts
const msgHash = new Uint8Array(Buffer.from('82ff40c0a986c6a5cfad4ddf4c3aa6996f1a7837f9c398e17e5de5cbd5a12b28', 'hex'));
const v = 27n;
const r = new Uint8Array(Buffer.from('99e71a99cb2270b8cac5254f9e99b6210c6c10224a1579cf389ef88b20a1abe9', 'hex'));
const s = new Uint8Array(Buffer.from('129ff05af364204442bdb53ab6f18a99ab48acc9326fa689f228040429e3ca66', 'hex'));

// Import our implementation
const { ecrecover } = await import('./src/ecrecover.js');

// Import ethereumjs
const { ecrecover: ethereumjsEcrecover } = await import('@ethereumjs/util');

console.log('Native result:', Buffer.from(ecrecover(msgHash, v, r, s)).toString('hex'));
console.log('Ethereumjs result:', Buffer.from(ethereumjsEcrecover(msgHash, v, r, s)).toString('hex'));

// Let's verify which one is correct by checking if the signature verifies against the recovered pubkey
const nativePubKey = ecrecover(msgHash, v, r, s);
const ethPubKey = ethereumjsEcrecover(msgHash, v, r, s);

// Add 0x04 prefix for uncompressed pubkey
const nativeFullPubKey = new Uint8Array([0x04, ...nativePubKey]);
const ethFullPubKey = new Uint8Array([0x04, ...ethPubKey]);

// Verify signatures
const sig64 = new Uint8Array(64);
sig64.set(r, 0);
sig64.set(s, 32);

console.log('\nNative pubkey verifies:', secp256k1.verify(sig64, msgHash, nativeFullPubKey));
console.log('Ethereumjs pubkey verifies:', secp256k1.verify(sig64, msgHash, ethFullPubKey));

// The one that verifies is correct!
