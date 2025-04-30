/**
 * Factory function to create a Revm instance
 * @returns {import('./Revm.js').Revm} A new Revm instance
 */
export const createRevm = () => {
  /** @type {import('./Revm.js').WasmTevmEVM | null} */
  let instance = null;

  /**
   * Load the WASM module
   * @returns {Promise<any>} Promise that resolves to the WASM module
   */
  const loadWasmModule = async () => {
    try {
      const module = await import("../pkg/tevm_revm.js");

      const isNode =
        typeof process !== "undefined" &&
        process.versions != null &&
        process.versions.node != null;

      if (isNode) {
        const fs = await import("fs/promises");
        const path = await import("path");

        const moduleURL = new URL(import.meta.url);
        const modulePath = moduleURL.pathname;
        const dirPath = path.dirname(modulePath);
        const wasmPath = path.resolve(dirPath, "../pkg/tevm_revm_bg.wasm");
        const wasmBuffer = await fs.readFile(wasmPath);

        await module.default(wasmBuffer);
      } else {
        await module.default();
      }

      return module;
    } catch (error) {
      console.error("Failed to load WASM module:", error);
      throw new Error("Failed to initialize REVM WASM module");
    }
  };

  const readyPromise = loadWasmModule()
    .then((module) => {
      instance = new module.TevmEVM();
    })
    .catch((e) => {
      console.error("There was an error initializing wasm", e);
      return Promise.reject(e);
    });

  const getInstance = async () => {
    await readyPromise;
    return /** @type {import('./Revm.js').WasmTevmEVM} */ (instance);
  };

  return {
    ready: () => readyPromise,
    /**
     * Get the version of the REVM implementation
     * @returns {Promise<string>} The version string
     */
    async getVersion() {
      const instance = await getInstance();
      const versionJson = instance.get_version();
      const versionInfo = JSON.parse(versionJson);
      return versionInfo.version;
    },

    /**
     * Set account balance
     * @param {string} address The account address (hex string with 0x prefix)
     * @param {string} balance The balance in wei (decimal string)
     * @returns {Promise<void>}
     */
    async setAccountBalance(address, balance) {
      const instance = await getInstance();
      return instance.set_account_balance(address, balance);
    },

    /**
     * Set account code
     * @param {string} address The account address (hex string with 0x prefix)
     * @param {string} code The contract bytecode (hex string with 0x prefix)
     * @returns {Promise<void>}
     */
    async setAccountCode(address, code) {
      const instance = await getInstance();
      return instance.set_account_code(address, code);
    },

    /**
     * Execute a call in the EVM
     * @param {import('./Revm.js').EvmCallParams} params The call parameters
     * @returns {Promise<import('./Revm.js').EvmResult>} The result of the call
     */
    async call(params) {
      const instance = await getInstance();
      const input = {
        from: params.from,
        to: params.to,
        gas_limit: params.gasLimit,
        value: params.value,
        data: params.data,
      };

      const resultJson = instance.call(JSON.stringify(input));
      const result = JSON.parse(resultJson);

      return {
        success: result.success,
        gasUsed: result.gas_used,
        returnValue: result.return_value,
        error: result.error,
      };
    },

    /**
     * Reset the EVM state
     * @returns {Promise<void>}
     */
    async reset() {
      const instance = await getInstance();
      instance.reset();
    },
  };
};
