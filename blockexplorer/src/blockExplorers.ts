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

/**
 * Type of utility for interacting with a block explorer via [Effect.ts](https://github.com/Effect-TS/schema)
 * 
 * Initiate with any compliant block explorer for utils like generating the url for a transaction, block, or address.
 * @example
 * ```ts
 * const etherscan: SafeBlockExplorer = new SafeStandardBlockExplorer(
 *  name: 'Etherscan',
 *  url: 'https://etherscan.io',
 * )
 * const txUrl = Effect.runSync(etherscan.getTxUrl('0x1234'))
 * ```
 */
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

/**
 * Type of utility for interacting with a block explorer
 *
 * Initiate with any compliant block explorer for utils like generating the url for a transaction, block, or address.
 * @example
 * ```ts
 * const etherscan: BlockExplorer = new StandardBlockExplorer(
 *   name: 'Etherscan',
 *   url: 'https://etherscan.io',
 *   chainId: 1,
 * )
 * const txUrl = etherscan.getTxUrl('0x1234')
 */
type BlockExplorer = {
	chainId: number
	name: string
	url: string
	getTxUrl: (txId: Hex) => string
	getBlockUrl: (blockHash: Hex) => string
	getAddressUrl: (address: Address) => string
}

/**
 * Utility for interacting with a block explorer via [Effect.ts](
 * 
 * Initiate with any compliant block explorer for utils like generating the url for a transaction, block, or address.
 * @example
 * ```ts
 * import { Effect } from 'effect'
 *   const etherscan = new SafeStandardBlockExplorer(
 *   name: 'Etherscan',
 *   url: 'https://etherscan.io',
 *   chainId: 1,
 * )
 */
class SafeStandardBlockExplorer implements SafeBlockExplorer {
	constructor(
		/**
		 * The name of the block explorer e.g. 'etherscan'
		 */
		public readonly name: string,
		/**
		 * The url of the block explorer e.g. 'https://etherscan.io'
		 */
		public readonly url: string,
		/**
		 * The chain id of the block explorer e.g. 1
		 */
		public readonly chainId: number,
	) { }

	/**
		* Safely retrieves the transaction URL for a given transaction ID.
		* @param txId - The transaction ID in hexadecimal format.
		* @returns An effect that resolves to the transaction URL.
		* @example
		* ```ts
		* const txUrl = Effect.runSync(safeBlockExplorer.getTxUrl('0x1234'))
		* ```
		*/
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

	/**
	 * Safely retrieves the block URL for a given block hash.
	 * @param blockHash - The block hash in hexadecimal format.
	 * @returns An effect that resolves to the block URL.
	 * @example
	 * ```ts
	 * const blockUrl = Effect.runSync(safeBlockExplorer.getBlockUrl('0x1234'))
	 * ```
	 */
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

	/**
	 * Safely retrieves the address URL for a given address.
	 * @param address - The address.
	 * @returns An effect that resolves to the address URL.
	 * @example
	 * ```ts
	 * const addressUrl = Effect.runSync(safeBlockExplorer.getAddressUrl('0x1234'))
	 * ```
	 **/
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

/**
 * Utility for interacting with a block explorer
 * 
 * Initiate with any compliant block explorer for utils like generating the url for a transaction, block, or address.
 * @example
 * ```ts
 * const etherscan = new StandardBlockExplorer(
 *   name: 'Etherscan',
 *   url: 'https://etherscan.io',
 *   chainId: 1,
 * )
 *  const txUrl = etherscan.getTxUrl('0x1234')
 *  ```
 */
export class StandardBlockExplorer implements BlockExplorer {
	/**
	 * the SafeBlockExplorer being wrapped
	 */
	private readonly safeBlockExplorer: SafeBlockExplorer

	constructor(
		/**
		 * The name of the block explorer e.g. 'etherscan'
		 */
		public readonly name: string,
		/**
		 * The url of the block explorer e.g. 'https://etherscan.io'
		 */
		public readonly url: string,
		/**
		 * The chain id of the block explorer e.g. 1
		 */
		public readonly chainId: number,
	) {
		this.safeBlockExplorer = new SafeStandardBlockExplorer(name, url, chainId)
	}

	/**
	 * Retrieves the transaction URL for a given transaction ID.
	 * @param txId - The transaction ID in hexadecimal format.
	 * @returns The transaction URL.
	 * @throws new {@link InvalidHexStringError} if the transaction ID is not a valid hexadecimal string.
	 * @throws new {@link InvalidUrlError} if the block explorer URL is not a valid URL.
	 * @example
	 * ```ts
	 * const txUrl = etherscan.getTxUrl('0x1234')
	 * ```
	 */
	public readonly getTxUrl = (txHash: Hex): string => {
		return Effect.runSync(this.safeBlockExplorer.getTxUrl(txHash))
	}

	/**
	* Retrieves the block URL for a given block hash.
	* @param blockHash - The block hash in hexadecimal format.
		* @returns The block URL.
		* @throws new {@link InvalidHexStringError} if the block hash is not a valid hexadecimal string.
		* @throws new {@link InvalidUrlError} if the block explorer URL is not a valid URL.
		* @example
		* ```ts
		* const blockUrl = etherscan.getBlockUrl('0x1234')
		* ```
		*/
	public readonly getBlockUrl = (blockHash: Hex): string => {
		return Effect.runSync(this.safeBlockExplorer.getBlockUrl(blockHash))
	}

	/**
	* Retrieves the address URL for a given address.
	* @param address - The address.
	* @returns The address URL.
	* @throws new {@link InvalidAddressError} if the address is not a valid address.
	* @throws new {@link InvalidUrlError} if the block explorer URL is not a valid URL.
	* @example
	* ```ts
	* const addressUrl = etherscan.getAddressUrl('0x1234')
	* ```
	*/
	public readonly getAddressUrl = (address: Address): string => {
		return Effect.runSync(this.safeBlockExplorer.getAddressUrl(address))
	}
}
