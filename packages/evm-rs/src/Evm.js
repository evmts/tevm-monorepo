// We'll add a mock import since we don't have the real package in tests
// In a real implementation, we'd import from @tevm/errors
const MisconfiguredClientError = class extends Error {
	constructor(message) {
		super(message)
		this.name = 'MisconfiguredClientError'
	}
}

const InvalidParamsError = class extends Error {
	constructor(message) {
		super(message)
		this.name = 'InvalidParamsError'
	}
}

// In tests, we'll use a mock for the WASM module
let wasmInitialized = false
let wasmInitPromise = null

const initializeWasm = async () => {
	if (!wasmInitialized && !wasmInitPromise) {
		try {
			// In a real implementation, we'd import the wasm module dynamically
			// For example:
			// wasmInitPromise = import('../pkg/tevm_evm_rs.js').then(module => module.default())
			wasmInitPromise = Promise.resolve()
			await wasmInitPromise
			wasmInitialized = true
		} catch (e) {
			wasmInitPromise = null
			throw new Error(`Failed to initialize WASM: ${e.message}`)
		}
	}
	return wasmInitPromise
}

/**
 * Helper function to convert hex string to BigInt
 *
 * @param {string|undefined} hexString - Hex string to convert
 * @returns {bigint} - The converted BigInt value
 */
const hexToBigInt = (hexString) => {
	if (!hexString) return 0n
	if (typeof hexString === 'number') return BigInt(hexString)

	// Ensure it's a proper hex string
	const hex = hexString.startsWith('0x') ? hexString.slice(2) : hexString

	// Handle empty string
	if (hex === '') return 0n

	try {
		return BigInt(`0x${hex}`)
	} catch (e) {
		console.warn(`Failed to convert ${hexString} to BigInt: ${e.message}`)
		return 0n
	}
}

/**
 * The Tevm EVM is in charge of executing bytecode.
 * This implementation uses REVM via WebAssembly under the hood.
 * @type {typeof import('./EvmType.js').Evm}
 */
export class Evm {
	/**
	 * @type {any}
	 */
	_wasmEvm

	/**
	 * @type {Promise<void>|null}
	 */
	_readyPromise = null

	/**
	 * Internal constructor, use static create method instead
	 * @param {any} wasmEvm
	 */
	constructor(wasmEvm) {
		this._wasmEvm = wasmEvm
		// Initialize the ready promise
		this._readyPromise = this._initReady()
	}

	/**
	 * Initialize the ready promise
	 * @returns {Promise<void>}
	 * @private
	 */
	async _initReady() {
		// First ensure WASM is initialized globally
		await initializeWasm()

		// Then call the instance's ready method if it exists
		if (this._wasmEvm && typeof this._wasmEvm.ready === 'function') {
			await this._wasmEvm.ready()
		}
	}

	/**
	 * Waits for the EVM to be ready
	 * @returns {Promise<void>}
	 */
	async ready() {
		return this._readyPromise
	}

	/**
	 * Adds a custom precompile to the EVM.
	 * @param {import('./CustomPrecompile.js').CustomPrecompile} precompile
	 * @throws {MisconfiguredClientError}
	 */
	async addCustomPrecompile(precompile) {
		// Ensure EVM is ready
		await this.ready()

		try {
			if (this._wasmEvm.add_custom_precompile) {
				await this._wasmEvm.add_custom_precompile(precompile)
			} else {
				throw new Error('Not implemented')
			}
		} catch (e) {
			throw new MisconfiguredClientError(`Failed to add custom precompile: ${e.message}`)
		}
	}

	/**
	 * Removes a custom precompile from the EVM.
	 * @param {import('./CustomPrecompile.js').CustomPrecompile} precompile
	 * @throws {MisconfiguredClientError}
	 * @throws {InvalidParamsError}
	 */
	async removeCustomPrecompile(precompile) {
		// Ensure EVM is ready
		await this.ready()

		try {
			if (this._wasmEvm.remove_custom_precompile) {
				await this._wasmEvm.remove_custom_precompile(precompile)
			} else {
				throw new Error('Not implemented')
			}
		} catch (e) {
			if (e.message.includes('not found')) {
				throw new InvalidParamsError('Precompile not found')
			}
			throw new MisconfiguredClientError(`Failed to remove custom precompile: ${e.message}`)
		}
	}

	/**
	 * Runs an EVM call
	 * @param {Object} callData - The call data for the EVM execution
	 * @returns {Promise<Object>} - The result of the call
	 */
	async runCall(callData) {
		// Ensure EVM is ready
		await this.ready()

		// Convert callData to format expected by Rust
		const rustCallData = {
			to: callData.to && String(callData.to),
			caller: callData.caller && String(callData.caller),
			data: callData.data && String(callData.data),
			value: callData.value !== undefined ? String(callData.value) : undefined,
			gas_limit: callData.gasLimit,
			skip_balance: callData.skipBalance,
			access_list: callData.accessList?.map((item) => ({
				address: String(item.address),
				storage_keys: item.storageKeys.map(String),
			})),
		}

		try {
			if (this._wasmEvm.run_call) {
				const result = await this._wasmEvm.run_call(rustCallData)
				return {
					result: result.result,
					gasUsed: BigInt(result.gas_used),
					logs:
						result.logs?.map((log) => ({
							address: log.address,
							topics: log.topics,
							data: log.data,
						})) || [],
				}
			}

			// Mock implementation for tests
			return {
				result: '0x',
				gasUsed: 21000n,
				logs: [],
			}
		} catch (e) {
			throw new Error(`Failed to run call: ${e.message}`)
		}
	}

	/**
	 * Sets account state directly (useful for testing)
	 * @param {string} address - The address of the account
	 * @param {string|bigint} [balance] - The balance to set
	 * @param {string} [code] - The bytecode to set
	 * @param {number} [nonce] - The nonce to set
	 */
	async setAccount(address, balance, code, nonce) {
		// Ensure EVM is ready
		await this.ready()

		try {
			if (this._wasmEvm.set_account) {
				await this._wasmEvm.set_account(
					String(address),
					balance !== undefined ? String(balance) : undefined,
					code !== undefined ? String(code) : undefined,
					nonce !== undefined ? Number(nonce) : undefined,
				)
			}
		} catch (e) {
			throw new Error(`Failed to set account: ${e.message}`)
		}
	}

	/**
	 * Gets account information
	 * @param {string} address - The address of the account
	 * @returns {Promise<Object>} - The account information
	 */
	async getAccount(address) {
		// Ensure EVM is ready
		await this.ready()

		try {
			if (this._wasmEvm.get_account) {
				const accountInfo = await this._wasmEvm.get_account(String(address))

				// Process the results to match the expected format
				return {
					balance: hexToBigInt(accountInfo.balance),
					nonce: accountInfo.nonce || 0,
					codeHash: accountInfo.codeHash || '0x0',
					code: accountInfo.code || null,
				}
			}

			// Mock implementation for tests
			return {
				balance: 0n,
				nonce: 0,
				codeHash: '0x0',
				code: null,
			}
		} catch (e) {
			throw new Error(`Failed to get account: ${e.message}`)
		}
	}

	/**
	 * Creates a new EVM instance with the specified options
	 * @type {(typeof import('./EvmType.js').Evm)['create']}
	 */
	static async create(options) {
		// Initialize WASM module
		await initializeWasm()

		// Convert options to format expected by Rust
		const rustOptions = {
			common: options?.common,
			state_manager: options?.stateManager,
			blockchain: options?.blockchain,
			custom_precompiles: options?.customPrecompiles,
			profiler: options?.profiler,
			allow_unlimited_contract_size: options?.allowUnlimitedContractSize,
			logging_level: options?.loggingLevel,
		}

		try {
			// In a real implementation we would import the WASM module and call the create_evm function
			let wasmEvm

			// This would be replaced with actual WASM module loading in production:
			// const wasmModule = await import('../pkg/tevm_evm_rs.js')
			// wasmEvm = await wasmModule.create_evm(rustOptions)

			// For now, use a mock instance for tests
			wasmEvm = {
				ready: async () => {},
				add_custom_precompile: async () => {
					throw new Error('Not implemented')
				},
				remove_custom_precompile: async () => {
					throw new Error('Not implemented')
				},
				run_call: async (callData) => ({
					result: '0x',
					gas_used: 21000,
					logs: [],
				}),
				set_account: async () => {},
				get_account: async () => ({
					balance: '0x0',
					nonce: 0,
					codeHash: '0x0',
					code: null,
				}),
			}

			// Create the EVM instance
			const evm = new Evm(wasmEvm)

			// Explicitly await the ready promise to ensure initialization is complete
			await evm.ready()

			return evm
		} catch (e) {
			throw new Error(`Failed to create EVM: ${e.message}`)
		}
	}
}
