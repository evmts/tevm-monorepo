import type { AccountParams, AccountResult } from '../index.js'

/**
 * Handler for account tevm procedure
 */
export type AccountHandler = (params: AccountParams) => Promise<AccountResult>
