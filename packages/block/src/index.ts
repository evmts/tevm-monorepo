export { Block } from './block.js'
export { ClRequest } from './ClRequest.js'
export { type BeaconPayloadJson, executionPayloadFromBeaconPayload } from './from-beacon-payload.js'
export { blockFromRpc } from './from-rpc.js'
export { BlockHeader } from './header.js'
export { getDifficulty, valuesArrayToHeaderData } from './helpers.js'
export * from './types.js'

import { Block } from './block.js'
import type { BeaconPayloadJson } from './from-beacon-payload.js'
import { BlockHeader } from './header.js'
import type { BlockBytes, BlockData, BlockHeaderBytes, BlockOptions, ExecutionPayload, HeaderData } from './types.js'

/**
 * Creates a block from a block data dictionary
 * @param blockData - The block data
 * @param opts - Options for the block
 * @returns A new Block instance
 * @see Block.fromBlockData
 */
export function createBlock(blockData: BlockData, opts: BlockOptions): Block {
	return Block.fromBlockData(blockData, opts)
}

/**
 * Creates a block from a RLP-serialized block
 * @param serialized - The serialized block data
 * @param opts - Options for the block
 * @returns A new Block instance
 * @see Block.fromRLPSerializedBlock
 */
export function createBlockFromRLP(serialized: Uint8Array, opts: BlockOptions): Block {
	return Block.fromRLPSerializedBlock(serialized, opts)
}

/**
 * Creates a block from an array of Bytes values
 * @param values - The block values array
 * @param opts - Options for the block
 * @returns A new Block instance
 * @see Block.fromValuesArray
 */
export function createBlockFromValuesArray(values: BlockBytes, opts: BlockOptions): Block {
	return Block.fromValuesArray(values, opts)
}

/**
 * Creates a block from an execution payload
 * @param payload - The execution payload
 * @param opts - Options for the block
 * @returns A promise that resolves to a new Block instance
 * @see Block.fromExecutionPayload
 */
export async function createBlockFromExecutionPayload(payload: ExecutionPayload, opts: BlockOptions): Promise<Block> {
	return Block.fromExecutionPayload(payload, opts)
}

/**
 * Creates a block from a beacon payload JSON
 * @param payload - The beacon payload JSON
 * @param opts - Options for the block
 * @returns A promise that resolves to a new Block instance
 * @see Block.fromBeaconPayloadJson
 */
export async function createBlockFromBeaconPayload(payload: BeaconPayloadJson, opts: BlockOptions): Promise<Block> {
	return Block.fromBeaconPayloadJson(payload, opts)
}

/**
 * Creates a block header from header data
 * @param headerData - The header data
 * @param opts - Options for the block header
 * @returns A new BlockHeader instance
 * @see BlockHeader.fromHeaderData
 */
export function createBlockHeader(headerData: HeaderData, opts: BlockOptions): BlockHeader {
	return BlockHeader.fromHeaderData(headerData, opts)
}

/**
 * Creates a block header from a RLP-serialized header
 * @param serializedHeaderData - The serialized header data
 * @param opts - Options for the block header
 * @returns A new BlockHeader instance
 * @see BlockHeader.fromRLPSerializedHeader
 */
export function createBlockHeaderFromRLP(serializedHeaderData: Uint8Array, opts: BlockOptions): BlockHeader {
	return BlockHeader.fromRLPSerializedHeader(serializedHeaderData, opts)
}

/**
 * Creates a block header from an array of Bytes values
 * @param values - The header values array
 * @param opts - Options for the block header
 * @returns A new BlockHeader instance
 * @see BlockHeader.fromValuesArray
 */
export function createBlockHeaderFromValuesArray(values: BlockHeaderBytes, opts: BlockOptions): BlockHeader {
	return BlockHeader.fromValuesArray(values, opts)
}
