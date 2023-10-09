import {
	InvalidAddressError,
	InvalidHexStringError,
	parseAddressSafe,
	parseHexStringSafe,
} from '@evmts/schemas'
import { Effect, pipe } from 'effect'
import type { Address, Hex } from 'viem'

type SafeBlockExplorer = {
	chainId: number
	name: string
	url: string
	getTxUrl: (txId: Hex) => Effect.Effect<never, InvalidHexStringError, string>
	getBlockUrl: (
		blockId: Hex,
	) => Effect.Effect<never, InvalidHexStringError, string>
	getAddressUrl: (
		address: Address,
	) => Effect.Effect<never, InvalidAddressError, string>
}

export type BlockExplorer = {
	chainId: number
	name: string
	url: string
	getTxUrl: (txId: Hex) => string
	getBlockUrl: (blockId: Hex) => string
	getAddressUrl: (address: Address) => string
}

class SafeStandardBlockExplorer implements SafeBlockExplorer {
	constructor(
		public readonly name: string,
		public readonly url: string,
		public readonly chainId: number,
	) {}

	public readonly getTxUrl = <THex extends Hex>(
		txId: THex,
	): Effect.Effect<never, InvalidHexStringError, THex> => {
		return pipe(
			parseHexStringSafe(txId),
			Effect.map((txId) => `${this.url}/tx/${txId}`),
		) as Effect.Effect<never, InvalidHexStringError, THex>
	}

	public readonly getBlockUrl = <THex extends Hex>(
		blockId: THex,
	): Effect.Effect<never, InvalidHexStringError, THex> => {
		return pipe(
			parseHexStringSafe(blockId),
			Effect.map((blockId) => `${this.url}/block/${blockId}`),
		) as Effect.Effect<never, InvalidHexStringError, THex>
	}

	public readonly getAddressUrl = <TAddress extends Address>(
		address: TAddress,
	): Effect.Effect<never, InvalidAddressError, TAddress> => {
		return pipe(
			parseAddressSafe(address),
			Effect.map((address) => `${this.url}/address/${address}`),
		) as Effect.Effect<never, InvalidAddressError, TAddress>
	}
}

export class StandardBlockExplorer implements BlockExplorer {
	private readonly safeBlockExplorer: SafeBlockExplorer

	constructor(
		public readonly name: string,
		public readonly url: string,
		public readonly chainId: number,
	) {
		this.safeBlockExplorer = new SafeStandardBlockExplorer(name, url, chainId)
	}

	public readonly getTxUrl = (txHash: Hex): string => {
		return Effect.runSync(this.safeBlockExplorer.getTxUrl(txHash))
	}

	public readonly getBlockUrl = (blockHash: Hex): string => {
		return Effect.runSync(this.safeBlockExplorer.getBlockUrl(blockHash))
	}

	public readonly getAddressUrl = (address: Address): string => {
		return Effect.runSync(this.safeBlockExplorer.getAddressUrl(address))
	}
}
