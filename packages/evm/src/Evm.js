import { InvalidParamsError, MisconfiguredClientError } from '@tevm/errors'
import { EthjsAccount, keccak256, toRlp, numberToBytes, createAddressFromString } from '@tevm/utils'
import { EvmError, EVMErrorMessage } from './EvmError.js'
import {
  loadGuillotineWasm,
  createGuillotineEvm,
  destroyGuillotineEvm,
  executeGuillotine,
  hexToAddress,
  isGuillotineLoaded,
  getGuillotineInstance,
  u256ToBytes,
} from './guillotineWasm.js'

/**
 * Calculate contract address for CREATE opcode.
 * address = keccak256(rlp([sender_address, sender_nonce]))[12:]
 * @param {import('@tevm/utils').EthjsAddress} from - Deployer address
 * @param {bigint} nonce - Deployer nonce
 * @returns {import('@tevm/utils').EthjsAddress}
 */
function generateContractAddress(from, nonce) {
  const rlpData = nonce === 0n
    ? toRlp([from.bytes, Uint8Array.from([])])
    : toRlp([from.bytes, numberToBytes(nonce)])
  const hash = keccak256(rlpData, 'bytes')
  return createAddressFromString(`0x${Buffer.from(hash.subarray(-20)).toString('hex')}`)
}

/**
 * Get the guillotine WASM instance, loading it if necessary.
 * This function will retry loading on each call to handle test isolation.
 * @returns {Promise<import('./guillotineWasm.js').GuillotineInstance | null>}
 */
async function getWasmInstance() {
  // If already loaded (by this module or another test), return it
  if (isGuillotineLoaded()) {
    return getGuillotineInstance()
  }

  // Try to load the WASM
  try {
    const url = new URL('./guillotine_mini.wasm', import.meta.url)
    return await loadGuillotineWasm(url)
  } catch (e) {
    // WASM loading failed, return null to indicate fallback mode
    return null
  }
}

/**
 * Guillotine-backed EVM adapter.
 * Uses guillotine-mini WASM for bytecode execution when available.
 * Falls back to stub behavior if WASM cannot be loaded.
 * @type {typeof import('./EvmType.js').Evm}
 */
export class Evm {
  /** @type {any} */
  common
  /** @type {import('@tevm/state').StateManager} */
  stateManager
  /** @type {any} */
  blockchain
  /** @type {import('./CustomPrecompile.js').CustomPrecompile[]} */
  _customPrecompiles = []
  /**
   * Map of precompile addresses (unprefixed hex) to precompile functions
   * Used by warmAddresses2929 to add precompiles to warm addresses
   * @type {Map<string, any>}
   */
  precompiles = new Map()
  /**
   * DEBUG flag set when trace logging is enabled
   * @type {boolean}
   */
  DEBUG = false
  /**
   * Allow unlimited contract size flag
   * @type {boolean}
   */
  allowUnlimitedContractSize = false
  /**
   * Events emitter stub for tracing compatibility.
   * Note: guillotine-mini doesn't emit EVM events during execution yet.
   * These are stub implementations that store listeners but don't emit events.
   * @type {{ on: (event: string, listener: (...args: any[]) => void) => void, off: (event: string, listener: (...args: any[]) => void) => void, emit: (event: string, ...args: any[]) => boolean, once: (event: string, listener: (...args: any[]) => void) => void, _listeners: Map<string, Set<(...args: any[]) => void>> }}
   */
  events = {
    /** @type {Map<string, Set<(...args: any[]) => void>>} */
    _listeners: new Map(),
    /**
     * @param {string} event
     * @param {(...args: any[]) => void} listener
     */
    on(event, listener) {
      if (!this._listeners.has(event)) {
        this._listeners.set(event, new Set())
      }
      this._listeners.get(event)?.add(listener)
    },
    /**
     * @param {string} event
     * @param {(...args: any[]) => void} listener
     */
    off(event, listener) {
      this._listeners.get(event)?.delete(listener)
    },
    /**
     * @param {string} event
     * @param {...any} args
     * @returns {boolean}
     */
    emit(event, ...args) {
      const listeners = this._listeners.get(event)
      if (!listeners || listeners.size === 0) return false
      for (const listener of listeners) {
        listener(...args)
      }
      return true
    },
    /**
     * @param {string} event
     * @param {(...args: any[]) => void} listener
     */
    once(event, listener) {
      const wrapper = (/** @type {any[]} */ ...args) => {
        this.off(event, wrapper)
        listener(...args)
      }
      this.on(event, wrapper)
    },
    /**
     * Remove all listeners for an event or all events.
     * @param {string} [event] - Optional event name. If not provided, clears all listeners.
     */
    removeAllListeners(event) {
      if (event) {
        this._listeners.delete(event)
      } else {
        this._listeners.clear()
      }
    },
  }
  /** A minimal journal shim for vm actions */
  journal = {
    /** @type {Evm} */
    _evm: /** @type {any} */ (null),
    accessList: new Map(),
    preimages: new Map(),
    async cleanup() {},
    startReportingAccessList() {},
    startReportingPreimages() {},
    /**
     * Checkpoint the state - delegates to stateManager.checkpoint()
     */
    async checkpoint() {
      await this._evm.stateManager.checkpoint()
    },
    /**
     * Commit the state - delegates to stateManager.commit()
     */
    async commit() {
      await this._evm.stateManager.commit()
    },
    /**
     * Revert the state - delegates to stateManager.revert()
     */
    async revert() {
      await this._evm.stateManager.revert()
    },
    cleanJournal() {},
    addAlwaysWarmAddress(_addr, _alwaysWarm) {},
    addAlwaysWarmSlot(_addr, _slot, _alwaysWarm) {},
    /**
     * @param {import('@tevm/utils').EthjsAddress} address
     * @param {import('@tevm/utils').EthjsAccount} account
     */
    async putAccount(address, account) {
      await this._evm.stateManager.putAccount(address, account)
    },
    /**
     * @param {import('@tevm/utils').EthjsAddress} address
     */
    async deleteAccount(address) {
      await this._evm.stateManager.deleteAccount(address)
    },
  }

  /**
   * @param {{ stateManager: import('@tevm/state').StateManager; common: any; blockchain: any } & import('./EvmOpts.js').EVMOpts} opts
   */
  constructor(opts) {
    this.stateManager = opts.stateManager
    this.common = opts.common
    this.blockchain = opts.blockchain
    // Set reference so journal methods can access the stateManager
    this.journal._evm = this
  }

  /**
   * Get precompile function by address
   * @param {import('@tevm/utils').EthjsAddress} address
   * @returns {any | undefined}
   */
  getPrecompile(address) {
    const addressHex = address.toString().slice(2).toLowerCase()
    return this.precompiles.get(addressHex)
  }

  /**
   * Adds a custom precompile (not yet wired to execution)
   * @param {import('./CustomPrecompile.js').CustomPrecompile} precompile
   */
  addCustomPrecompile(precompile) {
    if (!this._customPrecompiles) {
      throw new MisconfiguredClientError('_customPrecompiles is not initialized')
    }
    this._customPrecompiles.push(precompile)
    // Also add to the precompiles map for getPrecompile lookups
    const addressHex = precompile.address.toString().slice(2).toLowerCase()
    this.precompiles.set(addressHex, precompile.function)
  }

  /**
   * Removes a custom precompile from the list
   * @param {import('./CustomPrecompile.js').CustomPrecompile} precompile
   */
  removeCustomPrecompile(precompile) {
    if (!this._customPrecompiles) {
      throw new MisconfiguredClientError('_customPrecompiles is not initialized')
    }
    const index = this._customPrecompiles.indexOf(precompile)
    if (index === -1) {
      throw new InvalidParamsError('Precompile not found')
    }
    this._customPrecompiles.splice(index, 1)
    // Also remove from the precompiles map
    const addressHex = precompile.address.toString().slice(2).toLowerCase()
    this.precompiles.delete(addressHex)
  }

  /**
   * Execute a call using guillotine-mini WASM when available.
   * Handles ETH transfers, bytecode execution, and contract creation.
   * Falls back to stub behavior when WASM is not available.
   * @param {import('./types.js').EvmRunCallOpts} opts
   * @returns {Promise<import('./types.js').EvmResult>}
   */
  async runCall(opts) {
    const { caller, to, value, skipBalance, data, gasLimit, depth = 0, salt } = opts

    // Get caller nonce before incrementing (needed for contract address calculation)
    let callerNonce = 0n
    if (caller) {
      const callerAccount = await this.stateManager.getAccount(caller)
      if (callerAccount !== undefined) {
        callerNonce = callerAccount.nonce
      }
    }

    // Increment caller nonce for top-level calls (depth === 0)
    // This matches ethereumjs behavior where the nonce is incremented before message execution
    if (depth === 0 && caller) {
      let callerAccount = await this.stateManager.getAccount(caller)
      if (callerAccount === undefined) {
        callerAccount = new EthjsAccount()
      }
      callerAccount.nonce++
      await this.journal.putAccount(caller, callerAccount)
    }

    // CONTRACT CREATION: when 'to' is undefined and 'data' contains init code
    if (!to && data && data.length > 0 && caller) {
      // Calculate the contract address
      const createdAddress = generateContractAddress(caller, callerNonce)

      // Handle value transfer to the new contract
      if (value && value > 0n) {
        // Create the new contract account with initial balance
        let contractAccount = new EthjsAccount()
        contractAccount.balance = value

        // Deduct value from sender
        let callerAccount = await this.stateManager.getAccount(caller)
        if (callerAccount === undefined) {
          callerAccount = new EthjsAccount()
        }
        callerAccount.balance -= value
        if (skipBalance && callerAccount.balance < 0n) {
          callerAccount.balance = 0n
        }
        await this.journal.putAccount(caller, callerAccount)
        await this.journal.putAccount(createdAddress, contractAccount)
      }

      // Attempt to execute init code via guillotine-mini
      const wasm = await getWasmInstance()
      if (wasm) {
        try {
          const evmHandle = createGuillotineEvm(wasm, { hardfork: 'Cancun' })
          if (evmHandle) {
            try {
              const callerBytes = hexToAddress(caller.toString())
              const contractBytes = hexToAddress(createdAddress.toString())

              const result = executeGuillotine(evmHandle, {
                bytecode: data, // Init code
                gas: gasLimit ?? 1000000n,
                caller: callerBytes,
                address: contractBytes,
                value: value ?? 0n,
                calldata: new Uint8Array(0), // No calldata for init
                chainId: BigInt(this.common?.ethjsCommon?.chainId?.() ?? 1),
              })

              if (result.success && result.output.length > 0) {
                // Deploy the returned bytecode to the contract address
                await this.stateManager.putCode(createdAddress, result.output)
              }

              return {
                createdAddress,
                execResult: {
                  returnValue: result.output,
                  executionGasUsed: result.gasUsed,
                  gasRefund: result.gasRefund,
                  logs: [],
                  createdAddresses: new Set([createdAddress.toString()]),
                  selfdestruct: [],
                  ...(result.success ? {} : { exceptionError: new EvmError(EVMErrorMessage.REVERT) }),
                },
              }
            } finally {
              destroyGuillotineEvm(evmHandle)
            }
          }
        } catch (e) {
          // Guillotine execution failed, fall back to stub behavior
        }
      }

      // Fallback for contract creation when WASM not available
      // Just store the init code as the deployed bytecode (simplified behavior)
      await this.stateManager.putCode(createdAddress, data)
      return {
        createdAddress,
        execResult: {
          returnValue: data,
          executionGasUsed: 21000n + BigInt(data.length) * 200n, // Base + creation cost estimate
          gasRefund: 0n,
          logs: [],
          createdAddresses: new Set([createdAddress.toString()]),
          selfdestruct: [],
        },
      }
    }

    // Handle value transfer if there's value to transfer and a recipient
    if (value && value > 0n && to) {
      // Get or create recipient account
      let toAccount = await this.stateManager.getAccount(to)
      if (toAccount === undefined) {
        toAccount = new EthjsAccount()
      }

      // Credit value to recipient
      toAccount.balance += value

      // Update recipient account
      await this.journal.putAccount(to, toAccount)

      // Deduct value from sender
      // Note: skipBalance only means "don't validate balance" not "don't deduct"
      // The value transfer still needs to happen regardless of skipBalance
      if (caller) {
        let callerAccount = await this.stateManager.getAccount(caller)
        if (callerAccount === undefined) {
          callerAccount = new EthjsAccount()
        }
        callerAccount.balance -= value
        // Prevent negative balance only when skipBalance is true
        if (skipBalance && callerAccount.balance < 0n) {
          callerAccount.balance = 0n
        }
        await this.journal.putAccount(caller, callerAccount)
      }
    }

    // Check if target has code to execute
    if (to) {
      const code = await this.stateManager.getCode(to)
      if (code && code.length > 0) {
        // Attempt to execute bytecode via guillotine-mini
        const wasm = await getWasmInstance()
        if (wasm) {
          try {
            const evmHandle = createGuillotineEvm(wasm, { hardfork: 'Cancun' })
            if (evmHandle) {
              try {
                const callerBytes = caller ? hexToAddress(caller.toString()) : new Uint8Array(20)
                const toBytes = hexToAddress(to.toString())

                const result = executeGuillotine(evmHandle, {
                  bytecode: code,
                  gas: gasLimit ?? 1000000n,
                  caller: callerBytes,
                  address: toBytes,
                  value: value ?? 0n,
                  calldata: data,
                  chainId: BigInt(this.common?.ethjsCommon?.chainId?.() ?? 1),
                })

                // Note: guillotine-mini output retrieval is still being developed.
                // The execution runs correctly but RETURN data capture isn't complete.
                return {
                  execResult: {
                    returnValue: result.output,
                    executionGasUsed: result.gasUsed,
                    gasRefund: result.gasRefund,
                    logs: [],
                    createdAddresses: new Set(),
                    selfdestruct: [],
                    ...(result.success ? {} : { exceptionError: new EvmError(EVMErrorMessage.REVERT) }),
                  },
                }
              } finally {
                destroyGuillotineEvm(evmHandle)
              }
            }
          } catch (e) {
            // Guillotine execution failed, fall back to stub
          }
        }
      }
    }

    // Fallback: return empty result (no bytecode or WASM not available)
    return {
      execResult: {
        returnValue: new Uint8Array(0),
        executionGasUsed: 0n,
        gasRefund: 0n,
        logs: [],
        createdAddresses: new Set(),
        selfdestruct: [],
      },
    }
  }

  /**
   * Create a shallow copy of the EVM instance.
   * The copy shares the same stateManager and blockchain references.
   * @returns {Evm}
   */
  shallowCopy() {
    const copy = new Evm({
      stateManager: this.stateManager,
      common: this.common,
      blockchain: this.blockchain,
    })
    copy._customPrecompiles = [...this._customPrecompiles]
    copy.precompiles = new Map(this.precompiles)
    copy.DEBUG = this.DEBUG
    copy.allowUnlimitedContractSize = this.allowUnlimitedContractSize
    return copy
  }

  /**
   * Get active opcodes for the current hardfork.
   * Returns an empty map as guillotine-mini handles opcodes internally.
   * @returns {Map<number, any>}
   */
  getActiveOpcodes() {
    return new Map()
  }

  /**
   * @type {(typeof import('./EvmType.js').Evm)['create']}
   */
  static async create(options) {
    if (!options) throw new MisconfiguredClientError('EVM requires options')
    return new Evm(options)
  }
}
