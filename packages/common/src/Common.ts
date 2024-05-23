import { type Common as EthjsCommon } from '@ethereumjs/common'
import { type Chain as ViemChain } from 'viem/chains'
/**
 * Common contains the common configuration set between all chains such as fee information, hardfork information, eip information, predeployed contracts, default block explorers and more.
 * extends ethereumjs Common class with the Viem Chain type
 */
export type Common = ViemChain & { ethjsCommon: EthjsCommon; copy: () => Common }
