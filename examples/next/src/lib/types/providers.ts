import { MemoryClient } from 'tevm';
import { Chain as BaseChain, PublicClient } from 'viem';

/**
 * @type {Chain}
 * @notice A Viem chain with a custom rpc url and a public client
 * @dev The rpc url will be used to create a Tevm memory client from a fork.
 * @dev The provider is useful to fetch ABIs with WhatsABI.
 */
export type Chain = BaseChain & {
  custom: {
    rpcUrl: string;
    provider: PublicClient;
  };
};

/**
 * @type {Client}
 * @notice A Tevm memory client
 * @dev This will be used to write/read to/from the chain's state.
 */
export type Client = MemoryClient;
