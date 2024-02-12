import { bytesToHex, getAddress, numberToHex } from 'viem'

/**
 * @param {import('@ethereumjs/block').Block} block
 * @param {bigint} chainId
 * @returns {import('viem').Block}
 */
export const ethjsBlockToViemBlock = (block, chainId) => {
	return {
		...(block.header.withdrawalsRoot
			? { withdrawalsRoot: bytesToHex(block.header.withdrawalsRoot) }
			: {}),
		uncles: block.uncleHeaders.map((h) => bytesToHex(h.hash())),
		transactionsRoot: bytesToHex(block.header.transactionsTrie),
		timestamp: block.header.timestamp,
		totalDifficulty: block.header.difficulty,
		/**
		 * @returns {never}
		 */
		get sealFields() {
			throw new Error('Not implemented')
		},
		baseFeePerGas: block.header.baseFeePerGas ?? null,
		difficulty: block.header.difficulty,
		extraData: bytesToHex(block.header.extraData),
		gasLimit: block.header.gasLimit,
		gasUsed: block.header.gasUsed,
		hash: bytesToHex(block.header.hash()),
		logsBloom: bytesToHex(block.header.logsBloom),
		miner: bytesToHex(block.header.coinbase.toBytes()),
		mixHash: bytesToHex(block.header.mixHash),
		nonce: bytesToHex(block.header.nonce),
		number: block.header.number,
		parentHash: bytesToHex(block.header.parentHash),
		receiptsRoot: bytesToHex(block.header.receiptTrie),
		stateRoot: bytesToHex(block.header.stateRoot),
		sha3Uncles: bytesToHex(block.header.uncleHash),
		size: BigInt(block.raw().length),
		withdrawals:
			block.withdrawals?.map((w) => ({
				address: getAddress(w.address.toString()),
				// huh? Why does viem make these hex
				amount: numberToHex(w.amount),
				index: numberToHex(w.index),
				validatorIndex: numberToHex(w.validatorIndex),
			})) ?? [],
		// TODO there is a good chance this has a bug
		transactions: /** @type any*/ (
			block.transactions.map((tx, i) => ({
				nonce: tx.nonce,
				hash: bytesToHex(tx.hash()),
				chainId,
				blockHash: bytesToHex(block.header.hash()),
				blockNumber: block.header.number,
				from: bytesToHex(tx.getSenderAddress().toBytes()),
				to: tx.to && bytesToHex(tx.to.toBytes()),
				gas: tx.gasLimit,
				input: bytesToHex(tx.data),
				value: tx.value,
				r: numberToHex(tx.r ?? 0n),
				s: numberToHex(tx.s ?? 0n),
				v: numberToHex(tx.v ?? 0n),
				transactionIndex: i,
				type: tx.type,
			}))
		),
	}
}
