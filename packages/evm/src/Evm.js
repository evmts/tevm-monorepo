import { InvalidParamsError, MisconfiguredClientError } from '@tevm/errors'

/**
 * Minimal Guillotine-backed EVM adapter.
 * Note: This is an initial adapter that stubs unsupported features.
 * It will be expanded to call guillotine-mini execution over time.
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
  /** A minimal journal shim for vm actions */
  journal = {
    /** @type {Evm} */
    _evm: /** @type {any} */ (null),
    accessList: new Map(),
    preimages: new Map(),
    async cleanup() {},
    startReportingAccessList() {},
    startReportingPreimages() {},
    async checkpoint() {},
    async commit() {},
    async revert() {},
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
   * Minimal runCall implementation. Returns empty exec result for now.
   * TODO: integrate guillotine-mini to execute bytecode and populate fields.
   * @param {import('./types.js').EvmRunCallOpts} _opts
   * @returns {Promise<import('./types.js').EvmResult>}
   */
  async runCall(_opts) {
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
   * @type {(typeof import('./EvmType.js').Evm)['create']}
   */
  static async create(options) {
    if (!options) throw new MisconfiguredClientError('EVM requires options')
    return new Evm(options)
  }
}
