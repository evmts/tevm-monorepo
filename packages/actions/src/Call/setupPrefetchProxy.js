import { createAddress } from "@tevm/address";
import { prefetchStorageFromAccessList } from "./prefetchStorageFromAccessList.js";
import { bytesToHex, numberToHex } from "viem";

/**
 * Sets up a proxy around the fork transport to detect storage-related requests
 * and trigger prefetching after the first uncached request
 *
 * @internal
 * @param {import('@tevm/node').TevmNode} client
 * @param {import("@tevm/evm").EvmRunCallOpts} evmInput
 * @param {import('./CallParams.js').CallParams} params
 */
export const setupPrefetchProxy = (client, evmInput, params) => {
  if (!client.forkTransport) return client;
  const forkTransport = client.forkTransport;

  let hasPrefetched = false;
  // Store the original request function
  const originalRequest = forkTransport.request.bind(forkTransport);

  const doPrefetch = async () => {
    if (hasPrefetched) return;
    hasPrefetched = true;
    /**
     * @type {import("../eth/EthJsonRpcResponse.js").EthCreateAccessListJsonRpcResponse['result']}
     */
    const accessList = await originalRequest({
      method: "eth_createAccessList",
      params: [
        {
          from: (
            evmInput.caller ??
            evmInput.origin ??
            createAddress(0)
          ).toString(),
          ...(evmInput.to ? { to: evmInput.to.toString() } : {}),
          ...(evmInput.gasLimit ? { gas: numberToHex(evmInput.gasLimit) } : {}),
          ...(evmInput.gasPrice
            ? { gasPrice: numberToHex(evmInput.gasPrice) }
            : {}),
          ...(evmInput.value ? { value: numberToHex(evmInput.value) } : {}),
          ...(evmInput.data ? { data: bytesToHex(evmInput.data) } : {}),
        },
        await (async () => {
          const vm = await client.getVm();
          const forkedBlock = vm.blockchain.blocksByTag.get("forked");
          if (!forkedBlock) {
            client.logger.error("Unexpected no fork block");
            return "latest";
          }
          if (!params.blockTag) {
            return forkedBlock.header.number;
          }
          const requestedBlock = await vm.blockchain.getBlockByTag(
            params.blockTag,
          );
          if (requestedBlock.header.number >= forkedBlock.header.number) {
            return forkedBlock.header.number;
          }
          return requestedBlock.header.number;
        })(),
      ],
    });
    if (!accessList) {
      return Promise.reject("Unexpected no access list returned");
    }
    prefetchStorageFromAccessList(client, accessList).catch((error) => {
      client.logger.error(
        { error },
        "Error during storage prefetching after first storage request",
      );
    });
  };

  forkTransport.request = async (request) => {
    // Check if this is a storage-related request
    if (
      request.method === "eth_getStorageAt" ||
      request.method === "eth_getProof"
    ) {
      client.logger.debug(
        { method: request.method },
        "First storage request detected, triggering prefetch",
      );
      doPrefetch();
    }

    // Forward the request to the original implementation
    return originalRequest(request);
  };

  return client;
};
