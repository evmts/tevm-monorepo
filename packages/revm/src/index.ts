/**
 * @tevm/revm module provides a Rust-based REVM implementation with WASM support
 * for high-performance EVM execution
 * @module
 */

import type { TevmEVM as WasmTevmEVM, EvmCallInput, EvmCallResult } from '../pkg/revm_wasm';

/**
 * Input parameters for EVM calls
 */
export interface EvmCallParams {
  /** The address that initiated the call (hex string with 0x prefix) */
  from: string;
  /** The address being called (hex string with 0x prefix) */
  to: string;
  /** The gas limit for the call (decimal string) */
  gasLimit: string;
  /** The value in wei to send with the call (decimal string) */
  value: string;
  /** The call data (hex string with 0x prefix) */
  data: string;
}

/**
 * Result of an EVM call
 */
export interface EvmResult {
  /** Whether the call was successful */
  success: boolean;
  /** The amount of gas used (decimal string) */
  gasUsed: string;
  /** The returned data (hex string with 0x prefix) */
  returnValue: string;
  /** Error message if the call failed */
  error?: string;
}

/**
 * EVM implementation using REVM through WebAssembly
 */
export class TevmEvm {
  private wasmModule: Promise<typeof import('../pkg/revm_wasm')>;
  private instance: WasmTevmEVM | null = null;

  /**
   * Create a new TevmEvm instance
   */
  constructor() {
    this.wasmModule = this.loadWasmModule();
  }

  /**
   * Load the WASM module
   * @returns Promise that resolves to the WASM module
   */
  private async loadWasmModule(): Promise<typeof import('../pkg/revm_wasm')> {
    try {
      // Dynamic import of the WASM module
      return await import('../pkg/revm_wasm');
    } catch (error) {
      console.error('Failed to load WASM module:', error);
      throw new Error('Failed to initialize REVM WASM module');
    }
  }

  /**
   * Initialize the EVM instance
   * @returns Promise that resolves when the EVM is ready
   */
  public async init(): Promise<void> {
    const wasmModule = await this.wasmModule;
    this.instance = new wasmModule.TevmEVM();
  }

  /**
   * Set account balance
   * @param address The account address (hex string with 0x prefix)
   * @param balance The balance in wei (decimal string)
   */
  public async setAccountBalance(address: string, balance: string): Promise<void> {
    if (!this.instance) {
      await this.init();
    }
    
    return this.instance!.set_account_balance(address, balance);
  }

  /**
   * Set account code
   * @param address The account address (hex string with 0x prefix)
   * @param code The contract bytecode (hex string with 0x prefix)
   */
  public async setAccountCode(address: string, code: string): Promise<void> {
    if (!this.instance) {
      await this.init();
    }
    
    return this.instance!.set_account_code(address, code);
  }

  /**
   * Execute a call in the EVM
   * @param params The call parameters
   * @returns The result of the call
   */
  public async call(params: EvmCallParams): Promise<EvmResult> {
    if (!this.instance) {
      await this.init();
    }
    
    const input: EvmCallInput = {
      from: params.from,
      to: params.to,
      gas_limit: params.gasLimit,
      value: params.value,
      data: params.data,
    };
    
    const resultJson = await this.instance!.call(JSON.stringify(input));
    const result = JSON.parse(resultJson) as EvmCallResult;
    
    return {
      success: result.success,
      gasUsed: result.gas_used,
      returnValue: result.return_value,
      error: result.error,
    };
  }

  /**
   * Reset the EVM state
   */
  public async reset(): Promise<void> {
    if (!this.instance) {
      await this.init();
    }
    
    this.instance!.reset();
  }
}

/**
 * Create a new TevmEvm instance
 * @returns A new TevmEvm instance
 */
export function createTevmEvm(): TevmEvm {
  return new TevmEvm();
}

export default createTevmEvm;