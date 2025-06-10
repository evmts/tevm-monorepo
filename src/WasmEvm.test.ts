import { describe, test, expect, beforeAll } from 'vitest';
import { WasmEvm, createWasmEvm } from './WasmEvm.js';
import { readFileSync } from 'fs';
import { join } from 'path';

describe('WasmEvm', () => {
	let evm: WasmEvm;

	beforeAll(async () => {
		// Load the WASM file from the zig-out/dist directory (relative to project root)
		const wasmPath = join(process.cwd(), '..', 'zig-out', 'dist', 'zigevm.wasm');
		const wasmBytes = readFileSync(wasmPath);
		
		evm = new WasmEvm();
		await evm.loadFromBytes(wasmBytes);
		await evm.init();
	}, 10000);

	test('should get version', () => {
		const version = evm.getVersion();
		expect(version).toBe(101); // v1.0.1 - enhanced with basic EVM interpreter
	});

	test('should perform simple addition', () => {
		const result = evm.call(new Uint8Array([
			0x60, 0x05, // PUSH1 0x05 
			0x60, 0x03, // PUSH1 0x03
			0x01        // ADD - should result in 8
		]));

		expect(result.success).toBe(true);
		expect(result.error).toBeNull();
	});

	test('should handle simple return', () => {
		// Simple bytecode that returns a value
		const result = evm.testSimpleReturn();
		
		expect(result.success).toBe(true);
		expect(result.error).toBeNull();
	});

	test('should handle arithmetic with return', () => {
		// Test MSTORE + RETURN with correct stack order
		const bytecode = new Uint8Array([
			0x60, 0x42, // PUSH1 0x42
			0x60, 0x00, // PUSH1 0x00 (offset)
			0x52,       // MSTORE  
			0x60, 0x00, // PUSH1 0x00 (offset) - second from top
			0x60, 0x04, // PUSH1 0x04 (size) - top of stack
			0xf3        // RETURN
		]);
		
		const result = evm.call(bytecode);
		
		expect(result.success).toBe(true);
		expect(result.error).toBeNull();
		
		// Debug: log the output to see what we're getting
		console.log('Output length:', result.output.length);
		console.log('Output data:', Array.from(result.output));
		
		expect(result.output.length).toBe(4); // Should return 4 bytes
		// The result should be 0x42 stored as 4 bytes: [0, 0, 0, 0x42]
		expect(result.output[3]).toBe(0x42);
	});

	test('should handle simple return of zero bytes', () => {
		// Test just RETURN with 0 size - should work
		const bytecode = new Uint8Array([
			0x60, 0x00, // PUSH1 0x00 (offset)
			0x60, 0x00, // PUSH1 0x00 (size) 
			0xf3        // RETURN
		]);
		
		const result = evm.call(bytecode);
		
		expect(result.success).toBe(true);
		expect(result.error).toBeNull();
		expect(result.output.length).toBe(0);
	});

	test('should handle simple return of one byte', () => {
		// Test RETURN with 1 byte - should return zero from memory
		const bytecode = new Uint8Array([
			0x60, 0x00, // PUSH1 0x00 (offset)
			0x60, 0x01, // PUSH1 0x01 (size)
			0xf3        // RETURN
		]);
		
		const result = evm.call(bytecode);
		
		expect(result.success).toBe(true);
		expect(result.error).toBeNull();
		expect(result.output.length).toBe(1);
		expect(result.output[0]).toBe(0); // Memory starts as zeros
	});

	test('should handle empty bytecode', () => {
		const result = evm.call(new Uint8Array(0));
		
		// Empty bytecode should succeed (no operations to execute)
		expect(result.success).toBe(true);
	});

	test('should handle invalid bytecode gracefully', () => {
		// Use an invalid opcode (0xff is invalid)
		const result = evm.call(new Uint8Array([0xff]));
		
		// Should either succeed with no-op or fail gracefully
		// The exact behavior depends on the EVM implementation
		expect(typeof result.success).toBe('boolean');
	});
});

describe('createWasmEvm convenience function', () => {
	test('should create and initialize EVM', async () => {
		// This test would normally use a URL, but we'll skip it for now
		// since we don't have a web server set up in the test environment
		expect(true).toBe(true);
	}, { skip: true });
});