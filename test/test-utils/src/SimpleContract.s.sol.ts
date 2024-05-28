import { createContract } from '@tevm/contract'
const _SimpleContract = {
	name: 'SimpleContract',
	humanReadableAbi: [
		'constructor(uint256 initialValue)',
		'event ValueSet(uint256 newValue)',
		'function get() view returns (uint256)',
		'function set(uint256 newValue)',
	],
} as const
export const SimpleContract = createContract(_SimpleContract)
