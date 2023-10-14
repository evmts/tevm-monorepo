import {
	InvalidAddressError,
	InvalidBlockNumberError,
	InvalidBytesError,
	InvalidUrlError,
	parseAddressSafe,
	parseBytesSafe,
	parseUrlSafe,
} from '@evmts/schemas'
import { Effect } from 'effect'

/**
 * @typedef {`0x${string}`} Hex
 * @typedef {`0x${string}`} Address
 */

/**
 * @typedef {Object} BlockExplorerOptions
 * @property {string} name
 * @property {string} url
 * @property {number} chainId
 */

/**
 * Utility for interacting with a block explorer via [Effect.ts](
 *
 * Initiate with any compliant block explorer for utils like generating the url for a transaction, block, or address.
 * @example
 * ```ts
 * import { Effect } from 'effect'
 * const etherscan = new SafeStandardBlockExplorer(
 *   name: 'Etherscan',
 *   url: 'https://etherscan.io',
 *   chainId: 1,
 * )
 * const txUrlEffect = etherscan.getTxUrl('0x1234')
 * ````
 */
export class SafeStandardBlockExplorer {
	/**
	 * Possible Error states of the Effects
	 *
	 * Can be used to handle errors in a typesafe way
	 * @type {Object}
	 * @property {InvalidUrlError} InvalidUrlError
	 * @property {InvalidBytesError} InvalidBytesError
	 * @property {InvalidAddressError} InvalidAddressError
	 * @property {InvalidBlockNumberError} InvalidBlockNumberError
	 */
	static ERRORS = {
		InvalidUrlError,
		InvalidBytesError,
		InvalidAddressError,
		InvalidBlockNumberError,
	}

	/**
	 * @param {BlockExplorerOptions} options - The options for the BlockExplorer.
	 */
	constructor(options) {
		this.name = options.name
		this.url = options.url
		this.chainId = options.chainId
	}

	/**
	 * Safely retrieves the transaction URL for a given transaction ID.
	 * @param {Hex} txId - The transaction ID in hexadecimal format.
	 * @returns {Effect.Effect<never, InvalidBytesError | InvalidUrlError, string>} An effect that resolves to the transaction URL.
	 * @example
	 * ```ts
	 * const etherscan = new StandardBlockExplorer(
	 *  name: 'Etherscan',
	 *  url: 'https://etherscan.io',
	 *  chainId: 1,
	 *  )
	 *  const txUrl = etherscan.getTxUrl('0x1234')
	 *  ```
	 */
	getTxUrl(txId) {
		return Effect.Do.pipe(
			Effect.bind('parsedTxId', () => parseBytesSafe(txId)),
			Effect.bind('parsedUrl', () => parseUrlSafe(this.url)),
			Effect.map(
				({ parsedUrl, parsedTxId }) => `${parsedUrl}/tx/${parsedTxId}`,
			),
		)
	}

	/**
	 * Safely retrieves the block URL for a given block hash.
	 * @param {Hex} blockHash - The block hash in hexadecimal format.
	 * @returns {Effect.Effect<never, InvalidBytesError | InvalidUrlError, string>} An effect that resolves to the block URL.
	 * @example
	 * ```ts
	 * const etherscan = new StandardBlockExplorer(
	 * name: 'Etherscan',
	 * url: 'https://etherscan.io',
	 * chainId: 1,
	 * )
	 * const blockUrl = etherscan.getBlockUrl('0x1234')
	 * ```
	 */
	getBlockUrl(blockHash) {
		return Effect.Do.pipe(
			Effect.bind('parsedBlockHash', () => parseBytesSafe(blockHash)),
			Effect.bind('parsedUrl', () => parseUrlSafe(this.url)),
			Effect.map(
				({ parsedUrl, parsedBlockHash }) =>
					`${parsedUrl}/block/${parsedBlockHash}`,
			),
		)
	}

	/**
	 * Safely retrieves the address URL for a given address.
	 * @param {Address} address - The address.
	 * @returns {Effect.Effect<never, InvalidAddressError | InvalidUrlError, string>} An effect that resolves to the address URL.
	 * @example
	 * ```ts
	 * const etherscan = new StandardBlockExplorer(
	 *   name: 'Etherscan',
	 *   url: 'https://etherscan.io',
	 *   chainId: 1,
	 * )
	 * const addressUrl = etherscan.getAddressUrl('0x1234')
	 * ```
	 */
	getAddressUrl(address) {
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
 * ```
 */
export class StandardBlockExplorer {
	/**
	 * Possible Error states of the Effects
	 *
	 * Can be used to handle errors in a typesafe way
	 * @type {Object}
	 * @property {InvalidUrlError} InvalidUrlError
	 * @property {InvalidBytesError} InvalidBytesError
	 * @property {InvalidAddressError} InvalidAddressError
	 * @property {InvalidBlockNumberError} InvalidBlockNumberError
	 * @example
	 * ```ts
	 * let url: string
	 * try {
	 *   url = etherscan.getTxUrl('0x1234')
	 * } catch(e) {
	 *   if (txUrl instanceof etherscan.ERRORS.InvalidBytesError) {
	 *     console.log('InvalidBytesError')
	 *   }
	 * }
	 *
	 *  console.log('InvalidBytesError')
	 *  }
	 *  ```
	 */
	static ERRORS = {
		InvalidUrlError,
		InvalidBytesError,
		InvalidAddressError,
		InvalidBlockNumberError,
	}

	/**
	 * @param {BlockExplorerOptions} options - The options for the BlockExplorer.
	 */
	constructor(options) {
		this.name = options.name
		this.url = options.url
		this.chainId = options.chainId
		this.safeBlockExplorer = new SafeStandardBlockExplorer(options)
	}

	/**
	 * Retrieves the transaction URL for a given transaction ID.
	 * @param {Hex} txId - The transaction ID in hexadecimal format.
	 * @returns {string} The transaction URL.
	 * @example
	 * ```ts
	 * const etherscan = new StandardBlockExplorer(
	 *   name: 'Etherscan',
	 *   url: 'https://etherscan.io',
	 *   chainId: 1,
	 * )
	 * const txUrl = etherscan.getTxUrl('0x1234')
	 * ```
	 */
	getTxUrl(txId) {
		return Effect.runSync(this.safeBlockExplorer.getTxUrl(txId))
	}

	/**
	 * Retrieves the block URL for a given block hash.
	 * @param {Hex} blockHash - The block hash in hexadecimal format.
	 * @returns {string} The block URL.
	 * @example
	 * ```ts
	 * const etherscan = new StandardBlockExplorer(
	 *   name: 'Etherscan',
	 *   url: 'https://etherscan.io',
	 *   chainId: 1,
	 * )
	 * const blockUrl = etherscan.getBlockUrl('0x1234')
	 * ```
	 */
	getBlockUrl(blockHash) {
		return Effect.runSync(this.safeBlockExplorer.getBlockUrl(blockHash))
	}

	/**
	 * Retrieves the address URL for a given address.
	 * @param {Address} address - The address.
	 * @returns {string} The address URL.
	 * @example
	 * ```ts
	 * const etherscan = new StandardBlockExplorer(
	 *  name: 'Etherscan',
	 *  url: 'https://etherscan.io',
	 *  chainId: 1,
	 *  )
	 *  const addressUrl = etherscan.getAddressUrl('0x1234')
	 *  ```
	 */
	getAddressUrl(address) {
		return Effect.runSync(this.safeBlockExplorer.getAddressUrl(address))
	}
}
