/**
 * TypeScript wrapper for the WASM EVM interface
 * 
 * This class provides a type-safe interface to the Zig EVM compiled to WebAssembly.
 * Currently using the minimal WASM interface for proof of concept.
 */
export class WasmEvm {
	private wasmModule: WebAssembly.Module | null = null;
	private wasmInstance: WebAssembly.Instance | null = null;
	private memory: WebAssembly.Memory | null = null;
	private initialized = false;

	/**
	 * Load the WASM module from a URL or file path
	 */
	async loadFromUrl(wasmUrl: string): Promise<void> {
		const response = await fetch(wasmUrl);
		const wasmBytes = await response.arrayBuffer();
		await this.loadFromBytes(new Uint8Array(wasmBytes));
	}

	/**
	 * Load the WASM module from bytes
	 */
	async loadFromBytes(wasmBytes: Uint8Array): Promise<void> {
		this.wasmModule = await WebAssembly.compile(wasmBytes);
		await this.instantiate();
	}

	/**
	 * Instantiate the WASM module with proper imports
	 */
	private async instantiate(): Promise<void> {
		if (!this.wasmModule) {
			throw new Error('WASM module not loaded');
		}

		// Create memory for the WASM module
		// This will be shared between JS and WASM
		this.memory = new WebAssembly.Memory({ 
			initial: 256, // 256 pages = 16MB initial
			maximum: 1024 // 1024 pages = 64MB maximum
		});

		const imports = {
			env: {
				memory: this.memory,
			},
		};

		this.wasmInstance = await WebAssembly.instantiate(this.wasmModule, imports);
	}

	/**
	 * Initialize the EVM instance
	 */
	async init(): Promise<void> {
		if (!this.wasmInstance) {
			throw new Error('WASM instance not created');
		}

		const exports = this.wasmInstance.exports as any;
		
		// Check if evmInit exists (full EVM) or skip for minimal EVM
		if (typeof exports.evmInit === 'function') {
			const result = exports.evmInit();
			if (result !== 0) {
				throw new Error(`EVM initialization failed with code: ${result}`);
			}
		}

		this.initialized = true;
	}

	/**
	 * Get the version of the EVM WASM module
	 */
	getVersion(): number {
		if (!this.wasmInstance) {
			throw new Error('WASM instance not created');
		}

		const exports = this.wasmInstance.exports as any;
		return exports.getVersion();
	}

	/**
	 * Execute EVM bytecode and return the result
	 */
	call(bytecode: Uint8Array, gasLimit: number = 1000000): EvmCallResult {
		if (!this.initialized) {
			throw new Error('EVM not initialized');
		}

		if (!this.wasmInstance || !this.memory) {
			throw new Error('WASM instance or memory not available');
		}

		const exports = this.wasmInstance.exports as any;
		const memoryBuffer = new Uint8Array(this.memory.buffer);

		// Allocate memory for input bytecode (handle empty bytecode)
		let bytecodePtr = 0;
		if (bytecode.length > 0) {
			bytecodePtr = exports.alloc(bytecode.length);
			if (!bytecodePtr) {
				throw new Error('Failed to allocate memory for bytecode');
			}
			// Copy bytecode to WASM memory
			memoryBuffer.set(bytecode, bytecodePtr);
		}

		// Allocate memory for output (1KB should be enough for most cases)
		const outputMaxLen = 1024;
		const outputPtr = exports.alloc(outputMaxLen);
		if (!outputPtr) {
			if (bytecode.length > 0 && bytecodePtr) {
				exports.free(bytecodePtr, bytecode.length);
			}
			throw new Error('Failed to allocate memory for output');
		}

		try {
			// Call the EVM (minimal version takes fewer parameters)
			const result = exports.evmCall(
				bytecodePtr,
				bytecode.length,
				outputPtr,
				outputMaxLen
			);

			// Parse the result
			if (result === 0) {
				// Success - read output
				const outputLen = new DataView(this.memory.buffer, outputPtr, 8).getBigUint64(0, true);
				const outputData = new Uint8Array(this.memory.buffer, outputPtr + 8, Number(outputLen));
				
				return {
					success: true,
					output: outputData.slice(), // Copy the data
					gasUsed: 0n, // TODO: Get actual gas used from WASM
					error: null
				};
			} else {
				// Error
				return {
					success: false,
					output: new Uint8Array(0),
					gasUsed: 0n,
					error: this.getErrorMessage(result)
				};
			}
		} finally {
			// Clean up allocated memory
			if (bytecode.length > 0 && bytecodePtr) {
				exports.free(bytecodePtr, bytecode.length);
			}
			exports.free(outputPtr, outputMaxLen);
		}
	}

	/**
	 * Convert error code to human-readable message
	 */
	private getErrorMessage(errorCode: number): string {
		switch (errorCode) {
			case -1: return 'EVM not initialized';
			case -2: return 'Execution failed';
			case -3: return 'Output buffer too small';
			case -4: return 'Execution reverted';
			default: return `Unknown error: ${errorCode}`;
		}
	}

	/**
	 * Test with a simple bytecode that just returns a value
	 * PUSH1 0x42 PUSH1 0x00 MSTORE PUSH1 0x20 PUSH1 0x00 RETURN
	 */
	testSimpleReturn(): EvmCallResult {
		// Bytecode: PUSH1 0x42, PUSH1 0x00, MSTORE, PUSH1 0x20, PUSH1 0x00, RETURN
		const bytecode = new Uint8Array([
			0x60, 0x42, // PUSH1 0x42
			0x60, 0x00, // PUSH1 0x00  
			0x52,       // MSTORE
			0x60, 0x20, // PUSH1 0x20
			0x60, 0x00, // PUSH1 0x00
			0xf3        // RETURN
		]);
		
		return this.call(bytecode);
	}

	/**
	 * Test with simple arithmetic: 2 + 3
	 * PUSH1 0x02 PUSH1 0x03 ADD PUSH1 0x00 MSTORE PUSH1 0x20 PUSH1 0x00 RETURN
	 */
	testArithmetic(): EvmCallResult {
		const bytecode = new Uint8Array([
			0x60, 0x02, // PUSH1 0x02
			0x60, 0x03, // PUSH1 0x03
			0x01,       // ADD
			0x60, 0x00, // PUSH1 0x00
			0x52,       // MSTORE  
			0x60, 0x20, // PUSH1 0x20
			0x60, 0x00, // PUSH1 0x00
			0xf3        // RETURN
		]);
		
		return this.call(bytecode);
	}

	/**
	 * Clean up resources
	 */
	deinit(): void {
		if (this.initialized && this.wasmInstance) {
			const exports = this.wasmInstance.exports as any;
			// Only call evmDeinit if it exists (full EVM)
			if (typeof exports.evmDeinit === 'function') {
				exports.evmDeinit();
			}
			this.initialized = false;
		}
	}
}

/**
 * Result of an EVM call
 */
export interface EvmCallResult {
	/** Whether the call succeeded */
	success: boolean;
	/** Output data from the call */
	output: Uint8Array;
	/** Gas used by the call */
	gasUsed: bigint;
	/** Error message if the call failed */
	error: string | null;
}

/**
 * Convenience function to create and initialize a WASM EVM instance
 */
export async function createWasmEvm(wasmUrl: string): Promise<WasmEvm> {
	const evm = new WasmEvm();
	await evm.loadFromUrl(wasmUrl);
	await evm.init();
	return evm;
}