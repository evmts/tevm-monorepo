import { base, mainnet, optimism, tevmDefault } from '@tevm/common'

export const chains = {
	[base.id]: base,
	[optimism.id]: optimism,
	[mainnet.id]: mainnet,
	[tevmDefault.id]: tevmDefault,
}
