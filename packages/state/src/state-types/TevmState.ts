import type { Address } from '@tevm/utils'
import type { AccountStorage } from './AccountStorage.js'

export type TevmState = {
  [key: Address]: AccountStorage
}
