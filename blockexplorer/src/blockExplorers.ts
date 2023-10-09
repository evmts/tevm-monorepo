import {
	type InvalidAddressError,
	InvalidBlockNumberError,
	type InvalidHexStringError,
	InvalidUrlError,
	parseAddressSafe,
	parseHexStringSafe,
	parseUrlSafe,
} from '@evmts/schemas'
import { Effect } from 'effect'
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
	getBlockUrl: (blockHash: Hex) => string
	getAddressUrl: (address: Address) => string
}

class SafeStandardBlockExplorer implements SafeBlockExplorer {
	constructor(
		public readonly name: string,
		public readonly url: string,
		public readonly chainId: number,
	) {}

	public readonly getTxUrl = (
		txId: Hex,
	): Effect.Effect<never, InvalidHexStringError | InvalidUrlError, string> => {
		return Effect.Do.pipe(
			Effect.bind('parsedTxId', () => parseHexStringSafe(txId)),
			Effect.bind('parsedUrl', () => parseUrlSafe(this.url)),
			Effect.map(
				({ parsedUrl, parsedTxId }) => `${parsedUrl}/tx/${parsedTxId}`,
			),
		)
	}

	public readonly getBlockUrl = (
		blockHash: Hex,
	): Effect.Effect<
		never,
		InvalidBlockNumberError | InvalidUrlError,
		string
	> => {
		return Effect.Do.pipe(
			Effect.bind('parsedBlockHash', () => parseHexStringSafe(blockHash)),
			Effect.bind('parsedUrl', () => parseUrlSafe(this.url)),
			Effect.map(
				({ parsedUrl, parsedBlockHash }) =>
					`${parsedUrl}/block/${parsedBlockHash}`,
			),
		) as Effect.Effect<never, InvalidBlockNumberError | InvalidUrlError, string>
	}

	public readonly getAddressUrl = (
		address: Address,
	): Effect.Effect<never, InvalidAddressError | InvalidUrlError, string> => {
		return Effect.Do.pipe(
			Effect.bind('parsedAddress', () => parseAddressSafe(address)),
			Effect.bind('parsedUrl', () => parseUrlSafe(this.url)),
			Effect.map(
				({ parsedUrl, parsedAddress }) =>
					`${parsedUrl}/address/${parsedAddress}`,
			),
		)
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
