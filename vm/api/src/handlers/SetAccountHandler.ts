import type { SetAccountParams, SetAccountResult } from '../index.js'

/**
 * Sets the state of a specific ethereum address
 * @example
 * import {parseEther} from 'tevm'
 *
 * await tevm.setAccount({
 *  address: '0x123...',
 *  deployedBytecode: '0x6080604...',
 *  balance: parseEther('1.0')
 * })
 */
export type SetAccountHandler = (
	params: SetAccountParams,
) => Promise<SetAccountResult>
