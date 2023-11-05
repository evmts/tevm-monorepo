import type { EVMts } from '../evmts.js'
import {
	Account as EthjsAccount,
	Address as EthjsAddress,
} from '@ethereumjs/util'
import type { Address } from 'abitype'
import { hexToBytes, parseEther } from 'viem'

export type PutAccountAction = {
	account: Address
	balance?: bigint
}

export const putAccountHandler = async (
	evmts: EVMts,
	{ account, balance = parseEther('1000') }: PutAccountAction,
): Promise<EthjsAccount> => {
	const address = new EthjsAddress(hexToBytes(account))
	await evmts._evm.stateManager.putAccount(
		address,
		new EthjsAccount(BigInt(0), balance),
	)
	return evmts._evm.stateManager.getAccount(address) as Promise<EthjsAccount>
}
