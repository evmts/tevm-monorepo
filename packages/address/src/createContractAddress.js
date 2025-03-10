import { InvalidAddressError } from '@tevm/errors'
import { EthjsAddress, keccak256, toRlp } from '@tevm/utils'
import { numberToBytes } from 'viem'
import { Address } from './Address.js'
import { createAddress } from './createAddress.js'

/**
 * Generates an {@link Address} for a contract deployed using the standard CREATE opcode.
 * 
 * In Ethereum, contract addresses are deterministically generated based on the deployer's
 * address and their current nonce. This function implements that calculation, following
 * the formula:
 * 
 * `address = keccak256(rlp([sender_address, sender_nonce]))[12:]`
 * 
 * Where:
 * - rlp is the RLP encoding function
 * - keccak256 is the hash function
 * - [12:] means taking the last 20 bytes of the 32-byte hash
 * 
 * This is useful for:
 * - Predicting contract addresses before deployment
 * - Generating contract addresses in test environments
 * - Verifying contract deployment addresses
 *
 * @param {EthjsAddress} from - The address of the account deploying the contract
 * @param {bigint} nonce - The nonce of the deploying account at the time of deployment
 * @returns {Address} The contract address that will be (or was) generated
 * @throws {InvalidAddressError} If the 'from' parameter is not a valid EthjsAddress
 * 
 * @example
 * ```javascript
 * import { createAddress, createContractAddress } from '@tevm/address'
 * 
 * // Predict a contract's address before deployment
 * const deployerAddress = createAddress('0x8ba1f109551bD432803012645Ac136ddd64DBA72')
 * const deployerNonce = 5n // Current nonce of the deployer
 * 
 * const predictedAddress = createContractAddress(deployerAddress, deployerNonce)
 * console.log('Contract will be deployed at:', predictedAddress.toString())
 * 
 * // Using with a zero nonce (first deployment from an account)
 * const firstContractAddress = createContractAddress(deployerAddress, 0n)
 * ```
 * 
 * @example
 * ```javascript
 * // Example of calculating multiple contract addresses in sequence
 * import { createAddress, createContractAddress } from '@tevm/address'
 * 
 * const deployerAddress = createAddress('0x8ba1f109551bD432803012645Ac136ddd64DBA72')
 * const startingNonce = 10n
 * 
 * // Calculate addresses for a series of contracts to be deployed
 * const contractAddresses = []
 * for (let i = 0; i < 5; i++) {
 *   const nonce = startingNonce + BigInt(i)
 *   contractAddresses.push(
 *     createContractAddress(deployerAddress, nonce).toString()
 *   )
 * }
 * 
 * console.log('Upcoming contract addresses:', contractAddresses)
 * ```
 * 
 * @see {@link https://ethereum.org/en/developers/docs/smart-contracts/deploying/#contract-creation-code|Ethereum Contract Creation}
 * @see {@link https://eips.ethereum.org/EIPS/eip-161|EIP-161: State trie clearing} for nonce rules
 */
export const createContractAddress = (from, nonce) => {
	if (!(from.bytes instanceof Uint8Array)) {
		throw new InvalidAddressError('Expected from to be an Address or ethereumjs Address')
	}
	if (nonce === 0n) {
		return createAddress(keccak256(toRlp([from.bytes, Uint8Array.from([])]), 'bytes').subarray(-20))
	}
	return createAddress(keccak256(toRlp([from.bytes, numberToBytes(nonce)]), 'bytes').subarray(-20))
}
