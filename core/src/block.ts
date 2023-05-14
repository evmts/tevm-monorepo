import { common } from './hardFork'
import { Block } from '@ethereumjs/block'

export const block = Block.fromBlockData(
  { header: { extraData: Buffer.alloc(97) } },
  { common },
)
