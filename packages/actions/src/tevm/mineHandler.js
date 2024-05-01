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
      const pool = await client.getTxPool()
      const vm = await client.getVm().then(vm => vm.deepCopy())
      const receiptsManager = await client.getReceiptsManager()
      const parentBlock = await vm.blockchain.getCanonicalHeadBlock()
      let timestamp = Math.max(Date.now() / 1000, Number(parentBlock.header.timestamp))

      for (let count = 0; count < blockCount; count++) {
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
            setHardfork: true,
            putBlockIntoBlockchain: false,
          },
        })
        // TODO create a Log manager
        const orderedTx = await pool.txsByPriceAndNonce(vm, { baseFee: parentBlock.header.calcNextBaseFee() })

        console.info(
          `Miner: Assembling block from ${orderedTx.length} eligible txs (baseFee: ${parentBlock.header.calcNextBaseFee()}`
        )
        let index = 0
        let blockFull = false
        /**
         * @type {Array<import('@tevm/blockchain').TxReceipt>}
         */
        const receipts = []
        while (index < orderedTx.length && !blockFull) {
          const nextTx = /** @type {import('@tevm/tx').TypedTransaction}*/(orderedTx[index])
          try {
            const txResult = await blockBuilder.addTransaction(nextTx, {
              skipHardForkValidation: true,
            })
            receipts.push(txResult.receipt)
          } catch (error) {
            if (
            /** @type {Error}*/(error).message ===
              'tx has a higher gas limit than the remaining gas in the block'
            ) {
              if (blockBuilder.gasUsed > parentBlock.header.gasLimit - BigInt(21000)) {
                // If block has less than 21000 gas remaining, consider it full
                blockFull = true
                console.info(
                  `Miner: Assembled block full (gasLeft: ${parentBlock.header.gasLimit - blockBuilder.gasUsed})`
                )
              }
            } else {
              // If there is an error adding a tx, it will be skipped
              const hash = bytesToHex(nextTx.hash())
              console.debug(
                `Skipping tx ${hash}, error encountered when trying to add tx:\n${error}`
              )
            }
          }
          index++
        }
        const block = await blockBuilder.build()
        await receiptsManager?.saveReceipts(block, receipts)
        vm.blockchain.putBlock(block)
        pool.removeNewBlockTxs([block])
      }
      return {}
	}
