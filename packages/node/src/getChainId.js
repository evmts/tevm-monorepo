import { createJsonRpcFetcher } from "@tevm/jsonrpc";
import { hexToNumber } from "@tevm/utils";

/**
 * @param {{request: import('viem').EIP1193RequestFn} | import('viem').Transport} client
 */
export const getChainId = async (client) => {
  const transport = typeof client === "function" ? client({}) : client;
  const fetcher = createJsonRpcFetcher(transport);
  const { result: chainId, error } = await fetcher.request({
    jsonrpc: "2.0",
    method: "eth_chainId",
    id: 1,
    params: [],
  });
  console.log({ chainId, error });
  if (error || chainId === undefined) {
    console.error(error);
    throw error;
  }
  console.log(chainId);
  return hexToNumber(/** @type {import("@tevm/utils").Hex}*/ (chainId));
};
