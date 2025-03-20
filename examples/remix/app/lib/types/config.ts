import { MemoryClient } from "tevm";

import { Chain } from "./providers";

/**
 * @type {Object} UpdateAccountOptions
 * @notice Options for updating the account state (optional)
 * @param {boolean} updateAbi Whether to attempt to fetch/refetch the ABI at the provided address
 * @param {Chain} chain The chain to target for the abi retrieval
 * @param {MemoryClient} client The client to use for the account state
 */
export type UpdateAccountOptions = {
  updateAbi: boolean;
  chain: Chain;
  client: MemoryClient;
};
