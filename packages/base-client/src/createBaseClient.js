import { ReceiptsManager, createChain, createMapDb } from '@tevm/blockchain'
import { createCommon } from '@tevm/common'
import { createEvm } from '@tevm/evm'
import { createLogger } from '@tevm/logger'
import { createStateManager, dumpCanonicalGenesis, getForkBlockTag } from '@tevm/state'
import { TxPool } from '@tevm/txpool'
import { EthjsAccount, EthjsAddress, bytesToHex, hexToBigInt, numberToHex, parseEther, toHex } from '@tevm/utils'
import { createVm } from '@tevm/vm'
import { DEFAULT_CHAIN_ID } from './DEFAULT_CHAIN_ID.js'
import { addPredeploy } from './addPredeploy.js'
import { getChainId } from './getChainId.js'
import { INITIAL_ACCOUNTS } from './INITIAL_ACCOUNTS.js'

// TODO the common code is not very good and should be moved to common package
// it has rotted from a previous implementation where the chainId was not used by vm

/**
 * Creates the base instance of a memory client
 * @param {import('./BaseClientOptions.js').BaseClientOptions} [options]
 * @returns {import('./BaseClient.js').BaseClient}
 * @example
 * ```ts
 *  ```
 */
export const createBaseClient = (options = {}) => {
  const loggingLevel = options.loggingLevel ?? 'warn'
  const logger = createLogger({
    name: 'TevmClient',
    level: loggingLevel,
  })
  /**
   * @returns {import('@tevm/state').StateOptions }
   */
  const getStateManagerOpts = () => {
    /**
     * @type {import('@tevm/state').StateOptions['onCommit']}
     */
    const onCommit = (stateManager) => {
      if (!options.persister) {
        throw new Error('No persister provided')
      }
      logger.debug('persisting state manager...')
      dumpCanonicalGenesis(stateManager)().then((state) => {
        /**
         * @type {import('@tevm/state').ParameterizedTevmState}
         */
        const parsedState = {}

        for (const [k, v] of Object.entries(state)) {
          const { nonce, balance, storageRoot, codeHash } = v
          parsedState[k] = {
            ...v,
            nonce: toHex(nonce),
            balance: toHex(balance),
            storageRoot: storageRoot,
            codeHash: codeHash,
          }
        }
        options.persister?.persistTevmState(parsedState)
      })
    }
    if (options.fork?.url) {
      return {
        loggingLevel,
        fork: {
          ...options.fork,
          ...(options.persister ? { onCommit } : {}),
        },
      }
    }
    // handle normal mode
    if (options.persister) {
      return {
        loggingLevel,
        onCommit: /** @type any*/ (onCommit),
      }
    }
    return {
      loggingLevel,
    }
  }
  let stateManager = createStateManager(getStateManagerOpts())

  /**
   * Create the extend function in a generic way
   * @param {import('./BaseClient.js').BaseClient} client
   * @returns {import('./BaseClient.js').BaseClient['extend']}
   */
  const extend = (client) => (extension) => {
    Object.assign(client, extension(client))
    return /** @type {any}*/ (client)
  }

  const initChainId = async () => {
    if (options.chainId) {
      return options.chainId
    }
    const url = options.fork?.url
    if (url) {
      const id = await getChainId(url)
      return id
    }
    return DEFAULT_CHAIN_ID
  }

  const initVm = async () => {
    const blockTag = (() => {
      const blockTag = /** @type {import('@tevm/state').StateManager}*/ getForkBlockTag(stateManager._baseState) || {
        blockTag: 'latest',
      }
      if ('blockNumber' in blockTag && blockTag.blockNumber !== undefined) {
        return numberToHex(blockTag.blockNumber)
      }
      if ('blockTag' in blockTag && blockTag.blockTag !== undefined) {
        return blockTag.blockTag
      }
      return 'latest'
    })()
    logger.debug(blockTag, 'creating vm with blockTag...')

    // TODO we will eventually want to be setting common hardfork based on chain id and block number
    // ethereumjs does this for mainnet but we forgo all this functionality
    const common = createCommon({
      chainId: BigInt(await initChainId()),
      hardfork: 'cancun',
      loggingLevel,
      eips: options.eips ?? [],
    })

    const blockchain = await createChain({
      loggingLevel,
      common,
      ...(options.fork?.url !== undefined
        ? {
          fork: {
            url: options.fork.url,
            blockTag: blockTag.startsWith('0x')
              ? hexToBigInt(/** @type {import('@tevm/utils').Hex}*/(blockTag))
              : /** @type {import('@tevm/utils').BlockTag}*/ (blockTag),
          },
        }
        : {}),
    })

    await blockchain.ready()

    const headBlock = await blockchain.getCanonicalHeadBlock()

    logger.debug(headBlock.toJSON().header, 'created blockchain with head block')

    const initialState = await stateManager.dumpCanonicalGenesis()

    stateManager = createStateManager({
      ...getStateManagerOpts(),
      stateRoots: new Map([
        ...stateManager._baseState.stateRoots.entries(),
        // if we fork we need to make sure our state root applies to the head block
        [bytesToHex(headBlock.header.stateRoot), initialState],
      ]),
      currentStateRoot: bytesToHex(headBlock.header.stateRoot),
    })

    await stateManager.ready()

    const restoredState = options.persister?.restoreState()
    if (restoredState) {
      logger.debug(restoredState, 'Restoring persisted state...')
      /**
       * @type {import('@tevm/state').TevmState}
       */
      const parsedState = {}
      for (const [k, v] of Object.entries(restoredState)) {
        const { nonce, balance, storageRoot, codeHash } = v
        parsedState[/** @type {import('@tevm/utils').Address}*/ (k)] = {
          ...v,
          nonce: hexToBigInt(nonce),
          balance: hexToBigInt(balance),
          storageRoot: storageRoot,
          codeHash: codeHash,
        }
      }
      // We might want to double check we aren't forking and overwriting this somehow
      // TODO we should be storing blockchain state too
      stateManager = createStateManager({
        genesisState: parsedState,
        ...getStateManagerOpts(),
      })
      await stateManager.ready()
    }

    await Promise.all(
      INITIAL_ACCOUNTS.map((address) =>
        stateManager.putAccount(EthjsAddress.fromString(address), new EthjsAccount(0n, parseEther('1000'))),
      ),
    ).then(() => {
      logger.debug(INITIAL_ACCOUNTS, 'Accounts loaded with 1000 ETH')
    })

    const evm = await createEvm({
      common,
      stateManager,
      blockchain,
      allowUnlimitedContractSize: options.allowUnlimitedContractSize ?? false,
      customPrecompiles: options.customPrecompiles ?? [],
      profiler: options.profiler ?? false,
      loggingLevel,
    })
    logger.debug('created EVM interpreter')
    const vm = createVm({
      stateManager,
      evm,
      blockchain,
      common,
    })
    logger.debug('created vm')

    /**
     * Add custom predeploys
     */
    if (options.customPredeploys) {
      logger.debug(options.customPredeploys, 'adding predeploys')
      await Promise.all(
        options.customPredeploys.map((predeploy) => {
          addPredeploy({
            vm,
            address: predeploy.address,
            deployedBytecode: predeploy.contract.deployedBytecode,
          })
        }),
      )
    }

    logger.debug('state initialized checkpointing...')
    await stateManager.checkpoint()
    await stateManager.commit()

    await vm.ready().then(() => {
      logger.debug('vm is ready for use')
    })

    return vm
  }

  const vmPromise = initVm()
  const txPoolPromise = vmPromise.then((vm) => new TxPool({ vm }))
  const receiptManagerPromise = vmPromise.then((vm) => {
    logger.debug('initializing receipts manager...')
    return new ReceiptsManager(createMapDb({ cache: new Map() }), vm.blockchain)
  })

  /**
   * Create and return the baseClient
   * It will be syncronously created but some functionality
   * will be asyncronously blocked by initialization of vm and chainId
   * @type {import('./BaseClient.js').BaseClient}
   */
  const baseClient = {
    logger,
    getReceiptsManager: () => {
      return receiptManagerPromise
    },
    getTxPool: () => {
      return txPoolPromise
    },
    getVm: () => vmPromise,
    miningConfig: options.miningConfig ?? { type: 'auto' },
    mode: options.fork?.url ? 'fork' : 'normal',
    ...(options.fork?.url ? { forkUrl: options.fork.url } : { forkUrl: options.fork?.url }),
    extend: (extension) => extend(baseClient)(extension),
    ready: async () => {
      await vmPromise
      return true
    },
  }

  return baseClient
}
