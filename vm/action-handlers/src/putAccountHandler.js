import {
	Account as EthjsAccount,
	Address as EthjsAddress,
} from '@ethereumjs/util'
import { DEFAULT_BALANCE } from '@tevm/actions'
import { hexToBytes } from 'viem'

/**
 * @param {import("@ethereumjs/evm").EVM} evm
 * @param {import("@tevm/actions").PutAccountAction} action
 * @returns {Promise<import("@tevm/actions").PutAccountResponse>}
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
