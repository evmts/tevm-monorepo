import type { FeeMarket1559Tx } from '@ethereumjs/tx'

export interface ImpersonatedTx extends FeeMarket1559Tx {
	isImpersonated: true
}
