import { DEFAULT_BALANCE } from './DEFAULT_BALANCE.js'
import {
	Account as EthjsAccount,
	Address as EthjsAddress,
} from '@ethereumjs/util'
import { hexToBytes } from 'viem'

/**
 * @param {import("../../tevm.js").Tevm} tevm
 * @param {import("./PutAccountAction.js").PutAccountAction} action
 * @returns {Promise<import("./PutAccountResult.js").PutAccountResult>}
 */
export const putAccountHandler = async (
	tevm,
	{ account, balance = DEFAULT_BALANCE },
) => {
	const address = new EthjsAddress(hexToBytes(account))
	await tevm._evm.stateManager.putAccount(
		address,
		new EthjsAccount(BigInt(0), balance),
	)
	const out = await tevm._evm.stateManager.getAccount(address)
	if (!out) {
		throw new Error('Account not successfuly put')
	}
	return out
}
