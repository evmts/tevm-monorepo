import { Chain, Common, Hardfork } from "@ethereumjs/common"

/**
 * Accesses chain and hardfork parameters and to provide
 * that abstracts away the network and hardfork state.
 */
export const createCommon = () => {
  return new Common({ chain: Chain.Mainnet, hardfork: Hardfork.Shanghai })
}
