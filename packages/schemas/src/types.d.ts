import type { Address } from './SAddress.js'

export type BlockNumber = number

/**
 * Returns a boolean indicating whether the provided number is a valid ethereum blocknumber
 * @param blockNumber The blocknumber to check
 * @returns A boolean indicating whether the provided number is a valid ethereum blocknumber
 * @example
 * isBlockNumber(0) // true
 * isBlockNumber(1) // true
 * isBlockNumber(100) // true
 * isBlockNumber(-1) // false
 * isBlockNumber(1.1) // false
 */
export type IsBlockNumber = (blockNumber: unknown) => blockNumber is BlockNumber

export type AddressBookEntry = {
	readonly blockCreated: number
	readonly address: Address
}

export type AddressBook<TContractNames extends string> = {
	readonly [contractName in TContractNames]: AddressBookEntry
}

export type IsAddressBook = <TContractNames extends string>(
	addressBook: unknown,
) => addressBook is AddressBook<TContractNames>
