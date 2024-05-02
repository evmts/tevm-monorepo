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
          },
        })
        // TODO create a Log manager
        const orderedTx = await pool.txsByPriceAndNonce(vm, { baseFee: parentBlock.header.calcNextBaseFee() })
        console.log('processing orderedTx length', orderedTx.length)

        let index = 0
        let blockFull = false
        /**
         * @type {Array<import('@tevm/blockchain').TxReceipt>}
         */
        const receipts = []
        while (index < orderedTx.length && !blockFull) {
          const nextTx = /** @type {import('@tevm/tx').TypedTransaction}*/(orderedTx[index])
          console.log('processing next tx...', index)
          try {
            try {
              nextTx.hash()
              console.log('hash worked huh?')
            } catch (e) {
              throw new Error('tx.hash() does not work')
            }
            const txResult = await blockBuilder.addTransaction(nextTx, {
              skipHardForkValidation: true,
            })
            receipts.push(txResult.receipt)
          } catch (error) {
            console.error('There wasn an error adding tx to block', error)
            // TODO remove me
            throw error
          }
          index++
        }
        const block = await blockBuilder.build()
        console.log('saving receipts...', receipts)
        block.transactions.forEach(tx => {
          tx.hash()
        })
        await receiptsManager?.saveReceipts(block, receipts)
        await vm.blockchain.putBlock(block)
        console.log('put block', bytesToHex(block.hash()))
        pool.removeNewBlockTxs([block])
        console.log('block exists?', bytesToHex(await vm.blockchain.getBlock(block.hash()).then(b => b.header.hash())))
      }
      return {}
    }
