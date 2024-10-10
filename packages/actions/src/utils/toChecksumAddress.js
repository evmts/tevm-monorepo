import { keccak256,stringToHex} from '@tevm/utils'

/**
 * @param {string} address
 * @returns String
 */
export const toChecksumAddress = (/** @type {string} */ address) => {

  if (typeof address !== 'string' || !/^(0x)?[0-9a-fA-F]{40}$/.test(address)) {
    throw new Error('Invalid Ethereum address format');
  }


  let addressLower=address.toLowerCase().replace(/^0x/, '');
  if(!addressLower){
    addressLower='0x';
  }

  // Hash the lowercase address using Keccak-256
  let hash = keccak256(stringToHex(addressLower));


const checksumAddress = '0x' + Array.from(addressLower)
  .map((char, i) => {
    const charCode = char.charCodeAt(0);
    // @ts-ignore
    const shouldUpperCase = Number.parseInt(hash[i], 16) > 7;

    if (charCode >= 48 && charCode <= 57) {  // '0'-'9'
      return char;  // Numbers remain unchanged
    } else if (charCode >= 97 && charCode <= 102) {  // 'a'-'f'
      return shouldUpperCase ? char.toUpperCase() : char;
    } else {
      throw new Error(`Invalid character ${char} in address.`);
    }
  })
  .join('');

return checksumAddress;


}
