import type { TevmNode } from './TevmNode.js'

export type Extension<TExtended> = (client: TevmNode) => TExtended
