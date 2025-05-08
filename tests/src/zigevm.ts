/**
 * TypeScript bindings for ZigEVM WebAssembly module
 */

// Result codes returned by WASM
export enum ZigEvmResult {
  Success = 0,
  OutOfGas = 1,
  InvalidOpcode = 2,
  StackOverflow = 3,
  StackUnderflow = 4,
  InvalidJump = 5,
  InvalidInput = 6,
  InternalError = 7,
  Reverted = 8,
  InvalidHandle = 9,
}

/**
 * Class that wraps the ZigEVM WebAssembly module
 */
export class ZigEvm {
  private wasmInstance: WebAssembly.Instance | null = null;
  private wasmExports: any = null;
  private memory: WebAssembly.Memory | null = null;

  /**
   * Initialize the ZigEVM WASM module
   * @param wasmPath Path to the WASM file
   */
  async init(wasmPath: string): Promise<void> {
    try {
      // On Node.js
      const fs = await import('fs');
      const wasmBuffer = fs.readFileSync(wasmPath);
      const wasmModule = await WebAssembly.compile(wasmBuffer);
      
      // Create memory with initial 1MB and maximum 64MB
      this.memory = new WebAssembly.Memory({ initial: 16, maximum: 1024 });
      
      const importObject = {
        env: {
          memory: this.memory,
        },
      };
      
      this.wasmInstance = await WebAssembly.instantiate(wasmModule, importObject);
      this.wasmExports = this.wasmInstance.exports;
      
      if (!this.wasmExports.zig_evm_create) {
        throw new Error('WASM module does not export expected functions');
      }
    } catch (error) {
      console.error('Failed to initialize ZigEVM WASM module:', error);
      throw error;
    }
  }
  
  /**
   * Check if the module is initialized
   */
  isInitialized(): boolean {
    return this.wasmInstance !== null && this.wasmExports !== null;
  }
  
  /**
   * Get the version of ZigEVM
   */
  getVersion(): string {
    if (!this.isInitialized()) {
      throw new Error('ZigEVM WASM module not initialized');
    }
    
    // Allocate buffer for result
    const bufferSize = 32;
    const bufferPtr = this.allocateMemory(bufferSize);
    
    // Call WASM function
    const length = this.wasmExports.zig_evm_version(bufferPtr, bufferSize);
    
    // Read result
    const result = this.readString(bufferPtr, length);
    
    return result;
  }
  
  /**
   * Create a new ZigEVM instance
   * @returns Instance handle or throws if creation fails
   */
  create(): number {
    if (!this.isInitialized()) {
      throw new Error('ZigEVM WASM module not initialized');
    }
    
    const handle = this.wasmExports.zig_evm_create();
    if (handle === 0) {
      throw new Error('Failed to create ZigEVM instance');
    }
    
    return handle;
  }
  
  /**
   * Destroy a ZigEVM instance
   * @param handle Instance handle
   */
  destroy(handle: number): void {
    if (!this.isInitialized()) {
      throw new Error('ZigEVM WASM module not initialized');
    }
    
    const result = this.wasmExports.zig_evm_destroy(handle);
    if (result === 0) {
      throw new Error('Failed to destroy ZigEVM instance (invalid handle)');
    }
  }
  
  /**
   * Execute EVM bytecode
   * @param handle Instance handle
   * @param code EVM bytecode
   * @param calldata Input data
   * @param gasLimit Gas limit
   * @param address Contract address
   * @param caller Caller address
   * @returns Result data
   */
  execute(
    handle: number,
    code: Uint8Array,
    calldata: Uint8Array = new Uint8Array(0),
    gasLimit: bigint = 100000000n,
    address: string = '0x0000000000000000000000000000000000000000',
    caller: string = '0x0000000000000000000000000000000000000000',
  ): { result: ZigEvmResult; data: Uint8Array } {
    if (!this.isInitialized()) {
      throw new Error('ZigEVM WASM module not initialized');
    }
    
    // Convert addresses to bytes
    const addressBytes = this.hexToBytes(address);
    const callerBytes = this.hexToBytes(caller);
    
    // Allocate memory for input data
    const codePtr = this.copyToMemory(code);
    const calldataPtr = this.copyToMemory(calldata);
    const addressPtr = this.copyToMemory(addressBytes);
    const callerPtr = this.copyToMemory(callerBytes);
    
    // Allocate memory for result data
    const resultSize = 1024; // Max result size
    const resultPtr = this.allocateMemory(resultSize);
    
    // Allocate memory for result size
    const resultLenPtr = this.allocateMemory(4);
    this.writeUint32(resultLenPtr, resultSize);
    
    // Call WASM function
    const resultCode = this.wasmExports.zig_evm_execute(
      handle,
      codePtr, code.length,
      calldataPtr, calldata.length,
      0, // value pointer - not used yet
      Number(gasLimit),
      addressPtr, callerPtr,
      resultPtr, resultLenPtr,
    );
    
    // Read result size
    const actualSize = this.readUint32(resultLenPtr);
    
    // Read result data
    const resultData = this.readMemory(resultPtr, actualSize);
    
    return {
      result: resultCode as ZigEvmResult,
      data: resultData,
    };
  }
  
  /**
   * Simple test function to verify WASM is working
   */
  testAdd(a: number, b: number): number {
    if (!this.isInitialized()) {
      throw new Error('ZigEVM WASM module not initialized');
    }
    
    return this.wasmExports.zig_add(a, b);
  }
  
  // Helper methods for memory management
  
  private allocateMemory(size: number): number {
    // This is a very simple allocator - in a real implementation,
    // we would need a proper memory management system
    const ptr = this.wasmExports.malloc ? this.wasmExports.malloc(size) : 0;
    
    if (ptr === 0) {
      throw new Error('Failed to allocate memory in WASM');
    }
    
    return ptr;
  }
  
  private copyToMemory(data: Uint8Array): number {
    const ptr = this.allocateMemory(data.length);
    
    const memoryArray = new Uint8Array(this.memory!.buffer);
    memoryArray.set(data, ptr);
    
    return ptr;
  }
  
  private readMemory(ptr: number, length: number): Uint8Array {
    const memoryArray = new Uint8Array(this.memory!.buffer);
    return memoryArray.slice(ptr, ptr + length);
  }
  
  private readString(ptr: number, length: number): string {
    const bytes = this.readMemory(ptr, length);
    return new TextDecoder().decode(bytes);
  }
  
  private writeUint32(ptr: number, value: number): void {
    const memoryArray = new Uint8Array(this.memory!.buffer);
    const view = new DataView(memoryArray.buffer);
    view.setUint32(ptr, value, true); // Little-endian
  }
  
  private readUint32(ptr: number): number {
    const memoryArray = new Uint8Array(this.memory!.buffer);
    const view = new DataView(memoryArray.buffer);
    return view.getUint32(ptr, true); // Little-endian
  }
  
  private hexToBytes(hex: string): Uint8Array {
    // Remove 0x prefix if present
    hex = hex.startsWith('0x') ? hex.slice(2) : hex;
    
    // Ensure even length
    if (hex.length % 2 !== 0) {
      hex = '0' + hex;
    }
    
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
      bytes[i / 2] = parseInt(hex.slice(i, i + 2), 16);
    }
    
    return bytes;
  }
}