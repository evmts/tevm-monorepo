import type { Address } from '@tevm/utils'
import type { KnownChainIds } from './KnownChainIds.js'

export type ContractUri = `evm://${KnownChainIds}/${Address}${'' | `?${string}`}`
