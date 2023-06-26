import { Transport } from 'viem'
import { Chain } from 'viem/chains'

type WalletClient = {}

export type WalletClientOptions = {
	chain: Chain
	// TODO make this our transport isntead
	transport: Transport
}

export const createWalletClient = (
	options: WalletClientOptions,
): WalletClient => {
	console.log(options)
	return {}
}
