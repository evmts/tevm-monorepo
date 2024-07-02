import type { ClRequest } from '@tevm/block'
import type { ApplyBlockResult } from './ApplyBlockResult.js'

/**
 * Result of {@link runBlock}
 */
export interface RunBlockResult extends Omit<ApplyBlockResult, 'bloom'> {
	/**
	 * The stateRoot after executing the block
	 */
	stateRoot: Uint8Array
	/**
	 * The bloom filter of the LOGs (events) after executing the block
	 */
	logsBloom: Uint8Array

	/**
	 * The requestsRoot for any CL requests in the block
	 */
	requestsRoot?: Uint8Array
	/**
	 * Any CL requests that were processed in the course of this block
	 */
	requests?: ClRequest[]
}
