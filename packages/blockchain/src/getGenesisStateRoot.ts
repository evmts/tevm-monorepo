import { genGenesisStateRoot } from './genGenesisStateRoot.js'
import {
  ChainGenesis,
  Common,
} from '@tevm/common'


/**
 * Returns the genesis state root if chain is well known or an empty state's root otherwise
 */
export async function getGenesisStateRoot(
  chainId:
    | 1
    | 5
    | 11155111
    | 17000
    | 69420,
  common: Common,
): Promise<Uint8Array> {
  const chainGenesis = ChainGenesis[chainId as keyof typeof ChainGenesis]
  return chainGenesis !== undefined ? chainGenesis.stateRoot : genGenesisStateRoot({}, common)
}
