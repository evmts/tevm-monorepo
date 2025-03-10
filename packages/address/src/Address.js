import { EthjsAddress, bytesToHex, getAddress } from '@tevm/utils'

/**
 * A specialized Ethereum address class that extends EthjsAddress with TEVM-specific
 * functionality. This class provides EIP-55 compliant checksummed address formatting
 * and consistent behavior across the TEVM ecosystem.
 * 
 * The Address class is the core representation of Ethereum addresses in TEVM's
 * low-level APIs. It handles the complexities of Ethereum addresses including:
 * - Proper hex encoding/decoding
 * - EIP-55 checksumming for error detection
 * - Consistent 20-byte binary representation
 * 
 * This class should typically be created using the `createAddress` factory function
 * rather than being instantiated directly.
 * 
 * @extends {EthjsAddress}
 * @example
 * ```javascript
 * import { createAddress } from '@tevm/address';
 *
 * // From checksummed hex string
 * let address = createAddress('0x8ba1f109551bD432803012645Ac136ddd64DBA72');
 * 
 * // From lowercase hex string
 * address = createAddress('0x8ba1f109551bd432803012645ac136ddd64dba72');
 * 
 * // From zero address
 * address = createAddress(`0x${'00'.repeat(20)}`);
 * 
 * // From number or bigint
 * address = createAddress(0);
 * address = createAddress(123456789n);
 * 
 * // From Uint8Array
 * address = createAddress(new Uint8Array(20));
 * 
 * // From unprefixed hex string
 * address = createAddress('8ba1f109551bd432803012645ac136ddd64dba72');
 * ```
 * 
 * @see {@link https://eips.ethereum.org/EIPS/eip-55|EIP-55: Mixed-case checksum address encoding}
 */
export class Address extends EthjsAddress {
	/**
	 * Returns the checksummed EIP-55 compliant address string.
	 * 
	 * Unlike the parent EthjsAddress class which returns lowercase strings,
	 * this implementation returns properly checksummed addresses for improved
	 * safety, readability, and compatibility.
	 * 
	 * @override
	 * @returns {import('@tevm/utils').Address} The checksummed Ethereum address as a string.
	 * 
	 * @example
	 * ```javascript
	 * import { createAddress } from '@tevm/address';
	 * 
	 * const address = createAddress('0x8ba1f109551bd432803012645ac136ddd64dba72');
	 * console.log(address.toString()); // '0x8ba1f109551bD432803012645Ac136ddd64DBA72'
	 * ```
	 */
	toString() {
		return getAddress(bytesToHex(this.bytes))
	}
}
