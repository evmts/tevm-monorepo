import type { Address } from '@tevm/utils'
import type { KnownChainIds } from './KnownChainsType.js'

export type ContractUri = `eth://${KnownChainIds}/${Address}${'' | `?${string}`}`
