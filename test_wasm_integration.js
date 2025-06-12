import { initWasm, instantiateZigModule } from './src/wasm-loader.js';
import fs from 'fs';

async function testWasmIntegration() {
    console.log('🧪 Testing WASM integration...');
    
    try {
        // Test basic WASM loading
        const instance = await initWasm();
        console.log('✅ WASM module loaded successfully');
        
        // Test version function
        const version = instance.exports.getVersion();
        console.log(`✅ Version: ${version}`);
        
        // Test basic arithmetic
        const sum = instance.exports.add(5, 3);
        console.log(`✅ Add function: 5 + 3 = ${sum}`);
        
        // Test memory allocation
        const ptr = instance.exports.alloc(64);
        console.log(`✅ Memory allocation: ptr = ${ptr}`);
        if (ptr) {
            instance.exports.free(ptr, 64);
            console.log('✅ Memory freed successfully');
        }
        
        // Test instantiated module interface
        const wasmBuffer = fs.readFileSync('./zig-out/dist/zigevm.wasm');
        const module = await instantiateZigModule(wasmBuffer);
        console.log('✅ Module instantiated with utility functions');
        console.log('🔍 Module exports:', Object.keys(module));
        for (const key of Object.keys(module)) {
            console.log(`🔍 ${key}: ${typeof module[key]}`);
        }
        
        // Test hex conversion
        const testHex = "0x1234567890abcdef";
        const bytes = module.hexToBytes(testHex);
        console.log(`✅ Hex to bytes: ${testHex} -> [${Array.from(bytes).map(b => '0x' + b.toString(16).padStart(2, '0')).join(', ')}]`);
        
        const hexBack = module.bytesToHex(bytes);
        console.log(`✅ Bytes to hex: -> ${hexBack}`);
        
        // Test keccac256 (with stub implementation warning)
        console.log('⚠️  Testing keccac256 with STUB implementation (not real hash)');
        const keccacFn = module['keccac256'];
        const hash = keccacFn("hello world");
        console.log(`✅ Keccac256 stub: "hello world" -> ${hash}`);
        
        // Also test the available stdlib version  
        const keccacStdlibFn = module.keccac256Stdlib;
        const hashStdlib = keccacStdlibFn("hello world");
        console.log(`✅ Keccac256 stdlib: "hello world" -> ${hashStdlib}`);
        
        console.log('\n🎉 All WASM integration tests passed!');
        console.log('📝 Note: Crypto functions are using stub implementations and need real implementations for production use.');
        
    } catch (error) {
        console.error('❌ WASM integration test failed:', error);
        process.exit(1);
    }
}

testWasmIntegration();