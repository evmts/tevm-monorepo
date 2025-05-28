import type { FeeMarket1559Tx as FeeMarketEIP1559Transaction } from '@ethereumjs/tx'

export interface ImpersonatedTx extends FeeMarketEIP1559Transaction {
	isImpersonated: true
}
