import type { GetAccountResult } from '@tevm/actions'

export type ExpectedState = Partial<Omit<GetAccountResult, 'address' | 'errors'>>
