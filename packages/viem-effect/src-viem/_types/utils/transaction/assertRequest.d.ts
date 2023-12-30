import type { SendTransactionParameters } from '../../actions/wallet/sendTransaction.js'
import type { Chain } from '../../types/chain.js'
export type AssertRequestParameters = Partial<SendTransactionParameters<Chain>>
export declare function assertRequest(args: AssertRequestParameters): void
//# sourceMappingURL=assertRequest.d.ts.map
