/**
 * Interface for WebAssembly bindings to Rust REVM implementation
 */
interface WasmTevmEVM {
  call: (inputJson: string) => string;
  set_account_balance: (address: string, balance: string) => void;
  set_account_code: (address: string, code: string) => void;
  reset: () => void;
  get_version: () => string;
}

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
 * Revm type as an object interface rather than a class
 */
export type Revm = {
  /**
   * @returns Promise that resolves when the EVM is ready
   */
  ready: () => Promise<void>;

  /**
   * Get the version of the REVM implementation
   * @returns The version string
   */
  getVersion: () => Promise<string>;

  /**
   * Set account balance
   * @param address The account address (hex string with 0x prefix)
   * @param balance The balance in wei (decimal string)
   */
  setAccountBalance: (address: string, balance: string) => Promise<void>;

  /**
   * Set account code
   * @param address The account address (hex string with 0x prefix)
   * @param code The contract bytecode (hex string with 0x prefix)
   */
  setAccountCode: (address: string, code: string) => Promise<void>;

  /**
   * Execute a call in the EVM
   * @param params The call parameters
   * @returns The result of the call
   */
  call: (params: EvmCallParams) => Promise<EvmResult>;

  /**
   * Reset the EVM state
   */
  reset: () => Promise<void>;
};

// Export internal WASM type for implementation use
export type { WasmTevmEVM };
