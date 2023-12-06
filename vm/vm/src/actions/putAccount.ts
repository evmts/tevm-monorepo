import type { Tevm } from '../tevm.js'
import {
	Account as EthjsAccount,
	Address as EthjsAddress,
} from '@ethereumjs/util'
import type { Address } from 'abitype'
import { Address as ZAddress } from 'abitype/zod'
import { hexToBytes, parseEther } from 'viem'
import { z } from 'zod'

const DEFAULT_BALANCE = parseEther('1000')

export const PutAccountActionValidator = z.object({
	account: ZAddress.describe('The account to give eth to'),
	balance: z
		.bigint()
		.optional()
		.default(DEFAULT_BALANCE)
		.describe('The balance to give the account'),
})

/**
 * Tevm action to put an account into the vm state
 */
export type PutAccountAction = {
	account: Address
	balance?: bigint
}

export const putAccountHandler = async (
	tevm: Tevm,
	{ account, balance = DEFAULT_BALANCE }: PutAccountAction,
): Promise<EthjsAccount> => {
	const address = new EthjsAddress(hexToBytes(account))
	await tevm._evm.stateManager.putAccount(
		address,
		new EthjsAccount(BigInt(0), balance),
	)
	return tevm._evm.stateManager.getAccount(address) as Promise<EthjsAccount>
}
