/**
 * @tevm/test-matchers
 *
 * Custom Vitest matchers for Tevm and EVM-related testing in TypeScript.
 * Provides chainable matchers for events, errors, storage/state, transactions, and blocks.
 */

// Export storage/state matchers
export { toHaveState } from './matchers/toHaveState.js'
export { toHaveStorage } from './matchers/toHaveStorage.js'
export { toHaveStorageAt } from './matchers/toHaveStorageAt.js'
export { toBeAccount } from './matchers/toBeAccount.js'

// Export transaction matchers
export { toConsumeGas, toConsumeGasLessThan, toConsumeGasGreaterThan } from './matchers/toConsumeGas.js'
export {
	toConsumeGasNativeToken,
	toConsumeGasNativeTokenLessThan,
	toConsumeGasNativeTokenGreaterThan,
} from './matchers/toConsumeGasNativeToken.js'
export { toChangeBalance } from './matchers/toChangeBalance.js'
export { toChangeTokenBalance } from './matchers/toChangeTokenBalance.js'
export { toTransfer } from './matchers/toTransfer.js'
export { toTransferTokens } from './matchers/toTransferTokens.js'
export { toCreateAddresses } from './matchers/toCreateAddresses.js'

// Export block matchers
export { toBeMined } from './matchers/toBeMined.js'
export { toContainTransactions } from './matchers/toContainTransactions.js'

// Export types
export type * from './types/index.js'
