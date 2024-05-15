import { FeeMarketEIP1559Transaction } from '@ethereumjs/tx'
import { EthjsAddress, keccak256 } from '@tevm/utils'

/**
* @param {import("@ethereumjs/tx").FeeMarketEIP1559TxData & {impersonatedAddress: EthjsAddress}} txData
* @param {import("@ethereumjs/tx").TxOptions} [opts]
* @returns {import('./ImpersonatedTx.js').ImpersonatedTx}
*/
export const createImpersonatedTx = (txData, opts) => {
const tx = new FeeMarketEIP1559Transaction(txData, opts)
return new Proxy(tx, {
get(target, prop) {
if (prop === 'hash') {
return () => {
try {
return target.hash()
} catch (e) {
return keccak256(target.getHashedMessageToSign(), 'bytes')
}
}
}
if (prop === 'isSigned') {
return () => true
}
if (prop === 'getSenderAddress') {
return () => txData.impersonatedAddress
}
return Reflect.get(target, prop)
},
})
}
