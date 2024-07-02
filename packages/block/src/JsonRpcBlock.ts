import type { JsonRpcTx } from '@tevm/tx'
import type { Hex, JsonRpcWithdrawal } from '@tevm/utils'
import type { VerkleExecutionWitness } from './VerkleExecutionWitness.js'

/*
 * Based on https://ethereum.org/en/developers/docs/apis/json-rpc/
 */
// TODO: Remove the string type and only keep Hex
export interface JsonRpcBlock {
	number: Hex | string // the block number. null when pending block.
	hash: Hex | string // hash of the block. null when pending block.
	parentHash: Hex | string // hash of the parent block.
	mixHash?: Hex | string // bit hash which proves combined with the nonce that a sufficient amount of computation has been carried out on this block.
	nonce: Hex | string // hash of the generated proof-of-work. null when pending block.
	sha3Uncles: Hex | string // SHA3 of the uncles data in the block.
	logsBloom: Hex | string // the bloom filter for the logs of the block. null when pending block.
	transactionsRoot: Hex | string // the root of the transaction trie of the block.
	stateRoot: Hex | string // the root of the final state trie of the block.
	receiptsRoot: Hex | string // the root of the receipts trie of the block.
	miner: Hex | string // the address of the beneficiary to whom the mining rewards were given.
	difficulty: Hex | string // integer of the difficulty for this block.
	totalDifficulty: Hex | string // integer of the total difficulty of the chain until this block.
	extraData: Hex | string // the “extra data” field of this block.
	size: Hex | string // integer the size of this block in bytes.
	gasLimit: Hex | string // the maximum gas allowed in this block.
	gasUsed: Hex | string // the total used gas by all transactions in this block.
	timestamp: Hex | string // the unix timestamp for when the block was collated.
	transactions: Array<JsonRpcTx | Hex | string> // Array of transaction objects, or 32 Bytes transaction hashes depending on the last given parameter.
	uncles: Hex[] | string[] // Array of uncle hashes
	baseFeePerGas?: Hex | string // If EIP-1559 is enabled for this block, returns the base fee per gas
	withdrawals?: Array<JsonRpcWithdrawal> // If EIP-4895 is enabled for this block, array of withdrawals
	withdrawalsRoot?: Hex | string // If EIP-4895 is enabled for this block, the root of the withdrawal trie of the block.
	blobGasUsed?: Hex | string // If EIP-4844 is enabled for this block, returns the blob gas used for the block
	excessBlobGas?: Hex | string // If EIP-4844 is enabled for this block, returns the excess blob gas for the block
	parentBeaconBlockRoot?: Hex | string // If EIP-4788 is enabled for this block, returns parent beacon block root
	executionWitness?: VerkleExecutionWitness | null // If Verkle is enabled for this block
	requestsRoot?: Hex | string // If EIP-7685 is enabled for this block, returns the requests root
	requests?: Array<Hex | string> // If EIP-7685 is enabled for this block, array of serialized CL requests
}
