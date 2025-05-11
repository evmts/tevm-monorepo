import { keccak256, bytesToHex } from 'viem/utils';

// Create a simple test data array
const data = new Uint8Array(32).fill(0xAA);

// Hash the data using Viem's keccak256
const hash = keccak256(data);

// Print the results
console.log('Input data:', bytesToHex(data));
console.log('Viem hash result:', bytesToHex(hash));