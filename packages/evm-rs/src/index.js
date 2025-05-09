/**
 * @fileoverview JavaScript wrapper for the evm-rs WASM module
 * @module @tevm/evm-rs
 */

/**
 * JavaScript wrapper for the evm-rs WASM module
 * @class EvmInterpreter
 */
export class EvmRsWrapper {
  /**
   * Initialize the EVM interpreter
   * @async
   * @returns {Promise<EvmRsWrapper>} An initialized wrapper
   */
  static async init() {
    // Dynamic import of the WASM module
    const wasm = await import('../pkg/evm_rs.js');
    await wasm.default(); // Initialize the WASM module
    return new EvmRsWrapper(wasm);
  }

  /**
   * @param {Object} wasmModule - The initialized WASM module
   * @private
   */
  constructor(wasmModule) {
    this.wasm = wasmModule;
    this.interpreter = new wasmModule.EvmInterpreter();
  }

  /**
   * Get a simple greeting from the WASM module
   * @param {string} name - Name to greet
   * @returns {string} A greeting message
   */
  greet(name) {
    return this.wasm.greet(name);
  }

  /**
   * Get the version of the EVM interpreter
   * @returns {string} The version string
   */
  getVersion() {
    return this.interpreter.get_version();
  }

  /**
   * Interpret EVM bytecode (placeholder for future implementation)
   * @param {string} bytecode - The EVM bytecode as a hex string
   * @returns {string} Interpretation result
   */
  interpret(bytecode) {
    return this.interpreter.interpret(bytecode);
  }
}

// Default export for convenience
export default EvmRsWrapper;