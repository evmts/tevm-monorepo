import type { FeeMarket1559Transaction } from '@ethereumjs/tx'

export interface ImpersonatedTx extends FeeMarket1559Transaction {
	isImpersonated: true
}
