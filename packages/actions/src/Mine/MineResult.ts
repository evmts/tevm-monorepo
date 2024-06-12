// TODO strongly type this error

import type { Hex } from '@tevm/utils'
import type { TevmMineError } from './TevmMineError.js'

/**
 * Result of Mine Method
 */
export type MineResult =
	| {
			blockHashes: Array<Hex>
			errors?: undefined
	  }
	| {
			blockHashes?: undefined
			/**
			 * Description of the exception, if any occurred
			 */
			errors?: TevmMineError[]
	  }
