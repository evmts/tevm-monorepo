import type { ParameterizedAccountStorage } from './ParameterizedAccountStorage.js'

// API friendly version of TevmState with bigints and uint8arrays replaced with hex strings
export type ParameterizedTevmState = {
	[key: string]: ParameterizedAccountStorage
}
