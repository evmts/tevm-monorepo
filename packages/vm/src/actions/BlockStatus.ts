import { Block } from '@tevm/block'
import type { BuildStatus } from './BuildStatus.js'

export type BlockStatus =
	| { status: BuildStatus.Pending | BuildStatus.Reverted }
	| { status: BuildStatus.Build; block: Block }
