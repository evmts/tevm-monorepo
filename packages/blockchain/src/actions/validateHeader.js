import { ConsensusAlgorithm } from '@tevm/common'
import { getBlock } from './getBlock.js'

/**
 * @param {import('../BaseChain.js').BaseChain} baseChain
 * @returns {import('../Chain.js').Chain['validateHeader']}
 */
export const validateHeader = (baseChain) => async (header, height) => {
	if (header.isGenesis()) {
		return
	}
	const parentHeader = (await getBlock(baseChain)(header.parentHash)).header

	const { number } = header
	if (number !== parentHeader.number + BigInt(1)) {
		throw new Error(`invalid number ${header.errorStr()}`)
	}

	if (header.timestamp <= parentHeader.timestamp) {
		throw new Error(`invalid timestamp ${header.errorStr()}`)
	}

	if (!(header.common.vmConfig.consensusType() === 'pos')) throw new Error('Tevm currently does not support pos')

	if (baseChain.common.vmConfig.consensusAlgorithm() === ConsensusAlgorithm.Clique) {
		const period = /** @type {any}*/ (baseChain.common.vmConfig.consensusConfig()).period
		// Timestamp diff between blocks is lower than PERIOD (clique)
		if (parentHeader.timestamp + BigInt(period) > header.timestamp) {
			throw new Error(`invalid timestamp diff (lower than period) ${header.errorStr()}`)
		}
	}

	header.validateGasLimit(parentHeader)

	if (height !== undefined) {
		const dif = height - parentHeader.number

		if (!(dif < BigInt(8) && dif > BigInt(1))) {
			throw new Error(`uncle block has a parent that is too old or too young ${header.errorStr()}`)
		}
	}

	// check blockchain dependent EIP1559 values
	if (header.common.vmConfig.isActivatedEIP(1559)) {
		// check if the base fee is correct
		let expectedBaseFee
		const londonHfBlock = baseChain.common.vmConfig.hardforkBlock('london')
		const isInitialEIP1559Block = number === londonHfBlock
		if (isInitialEIP1559Block) {
			expectedBaseFee = header.common.vmConfig.param('gasConfig', 'initialBaseFee')
		} else {
			expectedBaseFee = parentHeader.calcNextBaseFee()
		}

		if (header.baseFeePerGas !== expectedBaseFee) {
			throw new Error(`Invalid block: base fee not correct ${header.errorStr()}`)
		}
	}

	if (header.common.vmConfig.isActivatedEIP(4844)) {
		const expectedExcessBlobGas = parentHeader.calcNextExcessBlobGas()
		if (header.excessBlobGas !== expectedExcessBlobGas) {
			throw new Error(`expected blob gas: ${expectedExcessBlobGas}, got: ${header.excessBlobGas}`)
		}
	}
}
