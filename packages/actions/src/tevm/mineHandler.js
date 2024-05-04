import { bytesToHex } from '@tevm/utils'
import { maybeThrowOnFail } from './maybeThrowOnFail.js'
import { validateMineParams } from '@tevm/zod'

/**
 * @param {import("@tevm/base-client").BaseClient} client
 * @param {object} [options]
 * @param {boolean} [options.throwOnFail] whether to default to throwing or not when errors occur
 * @returns {import('@tevm/actions-types').MineHandler}
 */
export const mineHandler =
  (client, options = {}) =>
    async ({ throwOnFail = options.throwOnFail ?? true, ...params } = {}) => {
      const errors = validateMineParams(params)
      if (errors.length > 0) {
        return maybeThrowOnFail(throwOnFail, { errors })
      }
      const { interval = 1, blockCount = 1 } = params


      /**
       * @type {Array<import('@tevm/utils').Hex>}
       */
      const blockHashes = []

      for (let count = 0; count < blockCount; count++) {
        const pool = await client.getTxPool()
        const vm = await client.getVm()
        const receiptsManager = await client.getReceiptsManager()
        const parentBlock = await vm.blockchain.getCanonicalHeadBlock()
        let timestamp = Math.max(Math.floor(Date.now() / 1000), Number(parentBlock.header.timestamp))
        timestamp = count === 0 ? timestamp : timestamp + interval
        const blockBuilder = await vm.buildBlock({
          parentBlock,
          headerData: {
            timestamp,
            number: parentBlock.header.number + 1n,
            // The following 2 are currently not supported
            // difficulty: undefined,
            // coinbase,
            gasLimit: parentBlock.header.gasLimit,
            baseFeePerGas: parentBlock.header.calcNextBaseFee(),
          },
          blockOpts: {
            // Proof of authority not currently supported
            // cliqueSigner,
            // proof of work not currently supported
            //calcDifficultyFromHeader,
            setHardfork: false,
            putBlockIntoBlockchain: false,
            common: vm.common
          },
        })
        // TODO create a Log manager
        const orderedTx = await pool.txsByPriceAndNonce({ baseFee: parentBlock.header.calcNextBaseFee() })

        let index = 0
        let blockFull = false
        /**
         * @type {Array<import('@tevm/blockchain').TxReceipt>}
         */
        const receipts = []
        while (index < orderedTx.length && !blockFull) {
          const nextTx = /** @type {import('@tevm/tx').TypedTransaction}*/(orderedTx[index])
          nextTx.hash()
          const txResult = await blockBuilder.addTransaction(nextTx, {
            skipHardForkValidation: true,
          })
          receipts.push(txResult.receipt)
          index++
        }
        const block = await blockBuilder.build()
        block.transactions.forEach(tx => {
          tx.hash()
        })
        await receiptsManager.saveReceipts(block, receipts)
        await vm.blockchain.putBlock(block)
        pool.removeNewBlockTxs([block])

        blockHashes.push(bytesToHex(block.hash()))
      }
      return { blockHashes }
    }
