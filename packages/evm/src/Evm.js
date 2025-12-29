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
  /** A minimal journal shim for vm actions */
  journal = {
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
    async putAccount(_address, _account) {},
    async deleteAccount(_address) {},
  }

  /**
   * @param {{ stateManager: import('@tevm/state').StateManager; common: any; blockchain: any } & import('./EvmOpts.js').EVMOpts} opts
   */
  constructor(opts) {
    this.stateManager = opts.stateManager
    this.common = opts.common
    this.blockchain = opts.blockchain
  }

  /**
   * Adds a custom precompile (not yet wired to execution)
   * @param {import('./CustomPrecompile.js').CustomPrecompile} precompile
   */
  addCustomPrecompile(precompile) {
    this._customPrecompiles.push(precompile)
  }

  /**
   * Removes a custom precompile from the list
   * @param {import('./CustomPrecompile.js').CustomPrecompile} precompile
   */
  removeCustomPrecompile(precompile) {
    const index = this._customPrecompiles.indexOf(precompile)
    if (index === -1) {
      throw new InvalidParamsError('Precompile not found')
    }
    this._customPrecompiles.splice(index, 1)
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
