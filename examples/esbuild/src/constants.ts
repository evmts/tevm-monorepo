import { mainnet } from 'viem/chains'

export const rpcUrls = {
	1: process.env.RPC_URL_MAINNET ?? mainnet.rpcUrls.public.http[0],
}
