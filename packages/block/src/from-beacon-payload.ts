import { type Hex, numberToHex } from '@tevm/utils'
import type { ExecutionPayload, VerkleExecutionWitness } from './types.js'

type BeaconWithdrawal = {
	index: Hex
	validator_index: Hex
	address: Hex
	amount: Hex
}

// Payload json that one gets using the beacon apis
// curl localhost:5052/eth/v2/beacon/blocks/56610 | jq .data.message.body.execution_payload
/**
 * Represents the JSON structure of an execution payload from the Beacon API
 * 
 * This type uses snake_case property names as returned by the Beacon API,
 * as opposed to the camelCase used internally in Tevm. Used when fetching
 * execution payloads from a consensus layer client.
 * 
 * @see https://ethereum.github.io/beacon-APIs/ for the Beacon API specification
 * 
 * @example
 * ```typescript
 * import { BeaconPayloadJson, executionPayloadFromBeaconPayload } from '@tevm/block'
 * 
 * // Fetch the payload from a Beacon API
 * async function getExecutionPayload(blockNumber: number) {
 *   const response = await fetch(
 *     `http://localhost:5052/eth/v2/beacon/blocks/${blockNumber}`
 *   )
 *   const data = await response.json()
 *   
 *   // Extract and parse the execution payload
 *   const beaconPayload: BeaconPayloadJson = data.data.message.body.execution_payload
 *   
 *   // Convert to Tevm's internal ExecutionPayload format
 *   return executionPayloadFromBeaconPayload(beaconPayload)
 * }
 * ```
 */
export type BeaconPayloadJson = {
	parent_hash: Hex
	fee_recipient: Hex
	state_root: Hex
	receipts_root: Hex
	logs_bloom: Hex
	prev_randao: Hex
	block_number: Hex
	gas_limit: Hex
	gas_used: Hex
	timestamp: Hex
	extra_data: Hex
	base_fee_per_gas: Hex
	block_hash: Hex
	transactions: Hex[]
	withdrawals?: BeaconWithdrawal[]
	blob_gas_used?: Hex
	excess_blob_gas?: Hex
	parent_beacon_block_root?: Hex
	// the casing of VerkleExecutionWitness remains same camel case for now
	execution_witness?: VerkleExecutionWitness
}

type VerkleProofSnakeJson = {
	commitments_by_path: Hex[]
	d: Hex
	depth_extension_present: Hex
	ipa_proof: {
		cl: Hex[]
		cr: Hex[]
		final_evaluation: Hex
	}
	other_stems: Hex[]
}

type VerkleStateDiffSnakeJson = {
	stem: Hex
	suffix_diffs: {
		current_value: Hex | null
		new_value: Hex | null
		suffix: number | string
	}[]
}

type VerkleExecutionWitnessSnakeJson = {
	state_diff: VerkleStateDiffSnakeJson[]
	verkle_proof: VerkleProofSnakeJson
}

function parseExecutionWitnessFromSnakeJson({
	state_diff,
	verkle_proof,
}: VerkleExecutionWitnessSnakeJson): VerkleExecutionWitness {
	return {
		stateDiff: state_diff.map(({ stem, suffix_diffs }) => ({
			stem,
			suffixDiffs: suffix_diffs.map(({ current_value, new_value, suffix }) => ({
				currentValue: current_value,
				newValue: new_value,
				suffix,
			})),
		})),
		verkleProof: {
			commitmentsByPath: verkle_proof.commitments_by_path,
			d: verkle_proof.d,
			depthExtensionPresent: verkle_proof.depth_extension_present,
			ipaProof: {
				cl: verkle_proof.ipa_proof.cl,
				cr: verkle_proof.ipa_proof.cr,
				finalEvaluation: verkle_proof.ipa_proof.final_evaluation,
			},
			otherStems: verkle_proof.other_stems,
		},
	}
}

/**
 * Converts a beacon block execution payload JSON object {@link BeaconPayloadJson} to the {@link ExecutionPayload} data needed to construct a {@link Block}.
 * The JSON data can be retrieved from a consensus layer (CL) client on this Beacon API `/eth/v2/beacon/blocks/[block number]`
 */
export function executionPayloadFromBeaconPayload(payload: BeaconPayloadJson): ExecutionPayload {
	const executionPayload: ExecutionPayload = {
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
				: parseExecutionWitnessFromSnakeJson(payload.execution_witness as unknown as VerkleExecutionWitnessSnakeJson)
	}

	return executionPayload
}
