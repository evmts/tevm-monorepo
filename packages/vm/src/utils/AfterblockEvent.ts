import type { Block } from '@tevm/block'
import type { RunBlockResult } from './RunBlockResult.js'

export interface AfterBlockEvent extends RunBlockResult {
	// The block which just finished processing
	block: Block
}
