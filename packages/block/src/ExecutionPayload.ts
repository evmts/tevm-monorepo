// This file is originally adapted from ethereumjs and thus carries the same license
import type { Hex } from '@tevm/utils'
import type { VerkleExecutionWitness } from './VerkleExecutionWitness.js'
import type { WithdrawalV1 } from './WithdrawalV1.js'

// Note: all these strings are 0x-prefixed
// TODO: Remove the string type and only keep Hex
export type ExecutionPayload = {
	parentHash: Hex | string // DATA, 32 Bytes
	feeRecipient: Hex | string // DATA, 20 Bytes
	stateRoot: Hex | string // DATA, 32 Bytes
	receiptsRoot: Hex | string // DATA, 32 bytes
	logsBloom: Hex | string // DATA, 256 Bytes
	prevRandao: Hex | string // DATA, 32 Bytes
	blockNumber: Hex | string // QUANTITY, 64 Bits
	gasLimit: Hex | string // QUANTITY, 64 Bits
	gasUsed: Hex | string // QUANTITY, 64 Bits
	timestamp: Hex | string // QUANTITY, 64 Bits
	extraData: Hex | string // DATA, 0 to 32 Bytes
	baseFeePerGas: Hex | string // QUANTITY, 256 Bits
	blockHash: Hex | string // DATA, 32 Bytes
	transactions: Hex[] | string[] // Array of DATA - Array of transaction rlp strings,
	withdrawals?: WithdrawalV1[] // Array of withdrawal objects
	blobGasUsed?: Hex | string // QUANTITY, 64 Bits
	excessBlobGas?: Hex | string // QUANTITY, 64 Bits
	parentBeaconBlockRoot?: Hex | string // QUANTITY, 64 Bits
	// VerkleExecutionWitness is already a hex serialized object
	executionWitness?: VerkleExecutionWitness | null // QUANTITY, 64 Bits, null implies not available
	requestsRoot?: Hex | string | null // DATA, 32 bytes, null implies EIP 7685 not active yet
}
