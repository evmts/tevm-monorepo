import {
	Contract as EthersContract,
	Interface as EthersInterface,
} from 'ethers'

/**
 * Typesafe version of the ethers Interface class.
 */
export const Interface =
	/** @type {import('./Contract.js').TypesafeEthersInterfaceConstructor} */ (
		EthersInterface
	)

/**
 * Typesafe version of the ethers Contract class.
 */
export const Contract =
	/** @type {import('./Contract.js').TypesafeEthersContractConstructor} */ (
		EthersContract
	)
