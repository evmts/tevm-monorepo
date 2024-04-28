import {
  type Blockchain,
} from '@ethereumjs/blockchain'


/**
VM:
putBlock
validateHeader (not needed if you use VMs runBlock with skipHeaderValidation = true)
shallowCopy
*/

/**
 * Blockchain
 */
export type Chain =
  Pick<
    Blockchain,
    // needed by evm
    // (used only if one calls BLOCKHASH opcode)
    | 'getBlock'
    // used by vm
    | 'putBlock'
    | 'validateHeader'
    | 'shallowCopy'
  > & {

}
