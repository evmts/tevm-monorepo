import type { Common } from "@tevm/common"
import type { Block } from "@tevm/block"
import type { BaseChainOptions } from "./BaseChainOptions.js"
import type { BlockTag } from "@tevm/utils"

export type BaseChain = {
  options: BaseChainOptions
  common: Common
  /**
   * Mapping of block hashes to blocks
   */
  blocks: Map<Uint8Array, Block | undefined>
  /**
   * Mapping of named block tags such as 'latest' to blocks
   */
  blocksByTag: Map<BlockTag, Block | undefined>
  /**
   * Mapping of block numbers to blocks
   */
  blocksByNumber: Map<bigint, Block | undefined>
}
