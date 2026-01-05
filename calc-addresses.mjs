import { secp256k1 } from '@noble/curves/secp256k1.js';
import { keccak_256 } from '@noble/hashes/sha3.js';

function hexToBytes(hex) {
    hex = hex.startsWith('0x') ? hex.slice(2) : hex;
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < bytes.length; i++) {
        bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
    }
    return bytes;
}

function getAddressFromPrivateKey(privateKeyHex) {
    const privKey = hexToBytes(privateKeyHex);
    const pubKey = secp256k1.getPublicKey(privKey, false);
    const pubKeyNoPrefix = pubKey.slice(1);
    const addressHash = keccak_256(pubKeyNoPrefix);
    const address = addressHash.slice(-20);
    return '0x' + Buffer.from(address).toString('hex');
}

// Test vector 1
const privateKey1 = '0x3c9229289a6125f7fdf1885a77bb12c37a8d3b4962d936f7e3084dece32a3ca1';
console.log('Test vector 1:');
console.log('  Private key:', privateKey1);
console.log('  Correct address:', getAddressFromPrivateKey(privateKey1));

// For ecrecoverTestVectors, we need to recover from the signature
// Let's verify what address the signature was actually made with
console.log('\nFor ecrecoverTestVectors, we need to check what address the signature recovers to with our correct implementation...');

// Import our implementation
const { recoverAddress } = await import('./src/signature.js');

const hash1 = '0x852daa74cc3c31fe64542bb9b8764cfb91cc30f9acf9389071ffb44a9eefde46';
const r1 = 0xb814eaab5953337fed2cf504a5b887cddd65a54b7429d7b191ff1331ca0726b1n;
const s1 = 0x264de2660d307112075c15f08ba9c25c9a0cc6f8119aff3e7efb0a942773abb0n;
const v1 = 27;

const address1 = recoverAddress({ hash: hash1, signature: { r: r1, s: s1, v: v1 } });
console.log('ecrecoverTestVectors recovered address:', address1);

// Also recover from test vector 1
const hash2 = '0x8144a6fa26be252b86456491fbcd43c1de7e022241845ffea1c3df066f7cfede';
const r2 = 0x157098a1d96fad0945d44978e3c8f2d1d2410f8ed742652cbf13b6b031391e87n;
const s2 = 0x28521ff547f3c3242084d0d26f560a6ff1c91988d70d3284ff96f32caa373d78n;
const v2 = 27;

const address2 = recoverAddress({ hash: hash2, signature: { r: r2, s: s2, v: v2 } });
console.log('\nTest vector 1 recovered address:', address2);
console.log('Expected from private key:', getAddressFromPrivateKey(privateKey1));
console.log('Match:', address2.toLowerCase() === getAddressFromPrivateKey(privateKey1).toLowerCase());

