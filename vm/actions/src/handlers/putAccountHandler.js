import { DEFAULT_BALANCE } from '../constants/index.js'
import {
	Account as EthjsAccount,
	Address as EthjsAddress,
} from '@ethereumjs/util'
import { hexToBytes } from 'viem'

/**
 * @param {import("@ethereumjs/evm").EVM} evm
 * @param {import("../actions/index.js").PutAccountAction} action
 * @returns {Promise<import("../actions/index.js").PutAccountResponse>}
 */
export const putAccountHandler = async (
	evm,
	{ account, balance = DEFAULT_BALANCE },
) => {
	const address = new EthjsAddress(hexToBytes(account))
	await evm.stateManager.putAccount(
		address,
		new EthjsAccount(BigInt(0), balance),
	)
	const out = await evm.stateManager.getAccount(address)
	if (!out) {
		throw new Error('Account not successfuly put')
	}
	return out
}
