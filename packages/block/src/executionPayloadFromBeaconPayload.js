import { numberToHex } from '@tevm/utils'
import { parseExecutionWitnessFromSnakeJson } from './parseExecutionWitnessFromSnakeJson.js'

/**
 * Converts a beacon block execution payload JSON object {@link BeaconPayloadJson} to the {@link ExecutionPayload} data needed to construct a {@link Block}.
 * The JSON data can be retrieved from a consensus layer (CL) client on this Beacon API `/eth/v2/beacon/blocks/[block number]`
 * @param {import('./BeaconPayloadJson.js').BeaconPayloadJson}
 * @returns {import('./ExecutionPayload.js').ExecutionPayload}
 */
export const executionPayloadFromBeaconPayload = (payload) => {
	/**
	 * @type {import('./ExecutionPayload.js').ExecutionPayload}
	 */
	const executionPayload = {
		parentHash: payload.parent_hash,
		feeRecipient: payload.fee_recipient,
		stateRoot: payload.state_root,
		receiptsRoot: payload.receipts_root,
		logsBloom: payload.logs_bloom,
		prevRandao: payload.prev_randao,
		blockNumber: numberToHex(BigInt(payload.block_number)),
		gasLimit: numberToHex(BigInt(payload.gas_limit)),
		gasUsed: numberToHex(BigInt(payload.gas_used)),
		timestamp: numberToHex(BigInt(payload.timestamp)),
		extraData: payload.extra_data,
		baseFeePerGas: numberToHex(BigInt(payload.base_fee_per_gas)),
		blockHash: payload.block_hash,
		transactions: payload.transactions,
	}

	if (payload.withdrawals !== undefined && payload.withdrawals !== null) {
		executionPayload.withdrawals = payload.withdrawals.map((wd) => ({
			index: numberToHex(BigInt(wd.index)),
			validatorIndex: numberToHex(BigInt(wd.validator_index)),
			address: wd.address,
			amount: numberToHex(BigInt(wd.amount)),
		}))
	}

	if (payload.blob_gas_used !== undefined && payload.blob_gas_used !== null) {
		executionPayload.blobGasUsed = numberToHex(BigInt(payload.blob_gas_used))
	}
	if (payload.excess_blob_gas !== undefined && payload.excess_blob_gas !== null) {
		executionPayload.excessBlobGas = numberToHex(BigInt(payload.excess_blob_gas))
	}
	if (payload.parent_beacon_block_root !== undefined && payload.parent_beacon_block_root !== null) {
		executionPayload.parentBeaconBlockRoot = payload.parent_beacon_block_root
	}
	if (payload.execution_witness !== undefined && payload.execution_witness !== null) {
		// the casing structure in payload could be camel case or snake depending upon the CL
		executionPayload.executionWitness =
			payload.execution_witness.verkleProof !== undefined
				? payload.execution_witness
				: parseExecutionWitnessFromSnakeJson(payload.execution_witness)
	}

	return executionPayload
}
