import { keccak256,stringToHex} from '@tevm/utils'

/**
 * @param {string} address
 * @returns String
 */
export const toChecksumAddress = (/** @type {string} */ address) => {

  if (!address) {
    throw new Error('Invalid address provided');
  }


  let addressLower=address.toLowerCase().replace(/^0x/, '');
  if(!addressLower){
    addressLower='0x';
  }

  // Hash the lowercase address using Keccak-256
  let hash = keccak256(stringToHex(addressLower));


// Iterate over each character of the address and the corresponding hash
let checksumAddress = '0x';
for (let i = 0; i < addressLower.length; i++) {
  if(hash[i]){

  // @ts-ignore
    if (parseInt(hash[i], 16) >= 8) {
      // @ts-ignore
      checksumAddress += addressLower[i].toUpperCase();
    } else {
      checksumAddress += addressLower[i];
    }
  }
}

return checksumAddress;


}
