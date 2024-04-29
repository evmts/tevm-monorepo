import type { Common } from '@tevm/common'
import type { BlockTag } from 'viem'

export type ChainOptions = {
  common: Common
  fork?: {
    url: string
    blockTag?: BlockTag | bigint
  }
}
