import type { PostByzantiumTxReceipt } from './PostByzantiumTxReceipt.js'
import type { PreByzantiumTxReceipt } from './PrebyzantiumTxReceipt.js'
import type { EIP4844BlobTxReceipt } from './EIP4844BlobTxReceipt.js'

export type TxReceipt = PreByzantiumTxReceipt | PostByzantiumTxReceipt | EIP4844BlobTxReceipt
