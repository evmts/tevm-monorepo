import { setAccountHandler } from '../index.js'
import { EthjsAddress } from '@tevm/utils'
import { hexToBytes } from '@tevm/utils'

/**
 * Parses user provided params into ethereumjs options to pass into the EVM
 * @param {import('@tevm/base-client').BaseClient} client
 * @param {import('@tevm/actions-types').CallParams} params
 * @returns {Promise<{data?: Parameters<import('@tevm/evm').Evm['runCall']>[0], errors?: Array<Error>}>}
 */
export const callHandlerOpts = async (client, params) => {
  /**
   * @type {Parameters<import('@tevm/evm').Evm['runCall']>[0]}
   */
  const opts = {}
  const vm = await client.getVm()

  // TODO need better error handling here
  const block = await (() => {
    console.log('params.blocktag', params.blockTag)
    if (params.blockTag === undefined) {
      console.log('defaulting latest...')
      return vm.blockchain.blocksByTag.get('latest')
    }
    if (typeof params.blockTag === 'bigint') {
      console.log('getting block by number...')
      return vm.blockchain.getBlock(params.blockTag)
    }
    if (typeof params.blockTag === 'string' && params.blockTag.startsWith('0x')) {
      console.log('getting block by block hash', (/** @type {import('@tevm/utils').Hex}*/(params.blockTag)))
      return vm.blockchain.getBlock(hexToBytes(/** @type {import('@tevm/utils').Hex}*/(params.blockTag)))
    }
    // TODO support all these and resolve all of them both vs fork and non fork
    if (params.blockTag === 'latest' || params.blockTag === 'safe' || params.blockTag === 'pending' || params.blockTag === 'earliest' || params.blockTag === 'finalized') {
      console.log('getting latest...')
      return vm.blockchain.blocksByTag.get(/** */(params.blockTag))
    }
    console.log('failure')
    throw new Error(`Unknown blocktag ${params.blockTag}`)
  })()
  if (!block) {
    // TODO need better error handling here
    throw new Error('No block found')
  }

  client.logger.debug({block: block.header}, 'Using block')
  
  opts.block = block

  console.log('huh')
  // handle block overrides
  if (params.blockOverrideSet) {
    client.logger.debug(
      params.blockOverrideSet,
      'callHandlerOpts: Detected a block override set',
    )
    // TODO this is a known bug we need to implement better support for block tags
    // We are purposefully ignoring this until the block creation is implemented
    const { header } = await vm.blockchain.getCanonicalHeadBlock()
    opts.block = {
      ...opts.block,
      header: {
        coinbase:
          params.blockOverrideSet.coinbase !== undefined
            ? EthjsAddress.fromString(params.blockOverrideSet.coinbase)
            : header.coinbase,
        number:
          params.blockOverrideSet.number !== undefined
            ? BigInt(params.blockOverrideSet.number)
            : header.number,
        difficulty: header.difficulty,
        prevRandao: header.prevRandao,
        gasLimit:
          params.blockOverrideSet.gasLimit !== undefined
            ? BigInt(params.blockOverrideSet.gasLimit)
            : header.gasLimit,
        timestamp:
          params.blockOverrideSet.time !== undefined
            ? BigInt(params.blockOverrideSet.time)
            : header.timestamp,
        baseFeePerGas:
          params.blockOverrideSet.baseFee !== undefined
            ? BigInt(params.blockOverrideSet.baseFee)
            : header.baseFeePerGas ?? BigInt(0),
        cliqueSigner() {
          return EthjsAddress.fromString(`0x${'00'.repeat(20)}`)
        },
        getBlobGasPrice() {
          if (params.blockOverrideSet?.blobBaseFee !== undefined) {
            return BigInt(params.blockOverrideSet.blobBaseFee)
          }
          return header.getBlobGasPrice()
        },
      },
    }
  }

  /**
   * @type {Array<Error>}
   */
  const errors = []
  console.log('huh')

  // handle state overrides
  if (params.stateOverrideSet) {
    client.logger.debug(
      params.stateOverrideSet,
      'callHandlerOpts: Detected a stateOverrideSet',
    )
    for (const [address, state] of Object.entries(params.stateOverrideSet)) {
      const res = await setAccountHandler(client)({
        address: /** @type import('@tevm/utils').Address*/ (address),
        ...(state.nonce !== undefined ? { nonce: state.nonce } : {}),
        ...(state.balance !== undefined ? { balance: state.balance } : {}),
        ...(state.code !== undefined ? { code: state.code } : {}),
        ...(state.state !== undefined ? { state: state.state } : {}),
        ...(state.stateDiff !== undefined
          ? { stateDiff: state.stateDiff }
          : {}),
        throwOnFail: false,
      })
      if (res.errors?.length) {
        errors.push(...res.errors)
      }
    }
  }
  console.log('huh')

  if (params.to) {
    opts.to = EthjsAddress.fromString(params.to)
  }
  console.log('huh')
  if (params.data) {
    opts.data = hexToBytes(params.data)
  }
  console.log('huh')
  if (params.salt) {
    opts.salt = hexToBytes(params.salt)
  }
  console.log('huh')
  if (params.depth) {
    opts.depth = params.depth
  }
  console.log('huh')
  if (params.blobVersionedHashes) {
    opts.blobVersionedHashes = params.blobVersionedHashes.map((hash) =>
      hexToBytes(hash),
    )
  }
  console.log('huh')
  if (params.selfdestruct) {
    opts.selfdestruct = params.selfdestruct
  }
  console.log('huh')
  if (params.skipBalance) {
    opts.skipBalance = Boolean(params.skipBalance)
  }
  console.log('huh')
  if (params.gasRefund) {
    opts.gasRefund = BigInt(params.gasRefund)
  }
  console.log('huh')
  if (params.gasPrice) {
    opts.gasPrice = BigInt(params.gasPrice)
  }
  console.log('huh')
  if (params.value) {
    opts.value = BigInt(params.value)
  }
  const caller = params.caller || params.from || params.origin || (params.createTransaction ? '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266' : `0x${'00'.repeat(20)}`)
  console.log('huh')
  if (caller) {
    opts.caller = EthjsAddress.fromString(caller)
  }
  const origin = params.origin || params.from || (params.createTransaction ? '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266' : `0x${'00'.repeat(20)}`)
  console.log('huh')
  if (origin) {
    opts.origin = EthjsAddress.fromString(origin)
  }
  console.log('huh')
  if (params.gas) {
    opts.gasLimit = BigInt(params.gas)
  }

  console.log('huh')

  return errors.length > 0 ? { data: opts, errors } : { data: opts }
}
