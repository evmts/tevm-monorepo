import type { AccountParams, AccountResult } from '../index.js'

export type AccountHandler = (params: AccountParams) => Promise<AccountResult>
