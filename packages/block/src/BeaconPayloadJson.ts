import { type Hex } from '@tevm/utils'
import type { VerkleExecutionWitness } from './VerkleExecutionWitness.js'
import type { BeaconWithdrawal } from './BeaconWithdrawal.js'

// Payload json that one gets using the beacon apis
// curl localhost:5052/eth/v2/beacon/blocks/56610 | jq .data.message.body.execution_payload
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
