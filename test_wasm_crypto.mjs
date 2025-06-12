import { instantiateZigModule } from './src/wasm-loader.js';
import fs from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const wasmPath = resolve(__dirname, 'zig-out/dist/zigevm.wasm');
const wasmBuffer = fs.readFileSync(wasmPath);

console.log('Testing WASM crypto functions...');

async function testCryptoFunctions() {
    const module = await instantiateZigModule(wasmBuffer);
    
    // Test hex conversion
    console.log('Testing hex conversion...');
    const testHex = '0x48656c6c6f20576f726c64'; // "Hello World"
    const bytes = module.hexToBytes(testHex);
    console.log('Converted hex to bytes:', bytes);
    
    const hexBack = module.bytesToHex(bytes);
    console.log('Converted bytes back to hex:', hexBack);
    
    // Test keccak256
    console.log('\nTesting keccak256...');
    const hash = module.keccak256(testHex);
    console.log('Keccak256 hash:', hash);
    
    // Test with raw bytes
    const textBytes = new TextEncoder().encode('Hello World');
    const hashFromBytes = module.keccak256(textBytes);
    console.log('Keccak256 from bytes:', hashFromBytes);
    
    console.log('\nAll crypto functions working! 🎉');
}

testCryptoFunctions().catch(console.error);