import type { EVMts } from '../evmts.js'
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
 * EVMts action to put an account into the vm state
 */
export type PutAccountAction = {
	account: Address
	balance?: bigint
}

export const putAccountHandler = async (
	evmts: EVMts,
	{ account, balance = DEFAULT_BALANCE }: PutAccountAction,
): Promise<EthjsAccount> => {
	const address = new EthjsAddress(hexToBytes(account))
	await evmts._evm.stateManager.putAccount(
		address,
		new EthjsAccount(BigInt(0), balance),
	)
	return evmts._evm.stateManager.getAccount(address) as Promise<EthjsAccount>
}
