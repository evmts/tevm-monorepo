import { createAddress } from "@tevm/address";
import { bytesToHex, numberToHex } from "viem";
import { prefetchStorageFromAccessList } from "./prefetchStorageFromAccessList.js";
import { ethCreateAccessListProcedure } from "../eth/ethCreateAccessListProcedure.js";

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
  const originalRequest = forkTransport.request.bind(forkTransport);

  let hasPrefetched = false;
  forkTransport.request = async (request) => {
    if (!hasPrefetched && ['eth_getStorageAt', 'eth_getProof'].includes(request.method)) {
      doPrefetch();// don't await on purpose
    }
    return originalRequest(request)
  };

  return client;

  async function doPrefetch() {
    if (hasPrefetched) throw new Error('Tried to prefetch twice!')
    hasPrefetched = true;
    client.logger.debug(
      "First storage request detected, triggering prefetch",
    );

    const blockTag = await (async () => {
      const vm = await client.getVm();
      const forkedBlock = vm.blockchain.blocksByTag.get("forked");

      if (!forkedBlock) {
        client.logger.error("Unexpected no fork block");
        return "latest";
      }
      if (!params.blockTag) {
        return numberToHex(forkedBlock.header.number);
      }
      const requestedBlock = await vm.blockchain.getBlockByTag(
        params.blockTag,
      );
      if (requestedBlock.header.number >= forkedBlock.header.number) {
        return numberToHex(forkedBlock.header.number);
      }
      return numberToHex(requestedBlock.header.number);
    })();

    const from = (
      evmInput.caller ??
      evmInput.origin ??
      createAddress(0)
    ).toString();

    const to = evmInput.to?.toString() ?? params.to;
    const gas = evmInput.gasLimit ? numberToHex(evmInput.gasLimit) : undefined;
    const gasPrice = evmInput.gasPrice ? numberToHex(evmInput.gasPrice) : undefined;
    const value = evmInput.value ? numberToHex(evmInput.value) : undefined;
    const data = evmInput.data ? bytesToHex(evmInput.data) : undefined;

    // Skip if we don't have a 'to' address
    if (!to) {
      client.logger.error("Cannot create access list without a 'to' address");
      return;
    }

    const createAccessListFn = ethCreateAccessListProcedure(client);
    const response = await createAccessListFn({
      jsonrpc: "2.0",
      method: "eth_createAccessList",
      params: [
        {
          from,
          to, // Now this is guaranteed to be defined
          ...(gas ? { gas } : {}),
          ...(gasPrice ? { gasPrice } : {}),
          ...(value ? { value } : {}),
          ...(data ? { data } : {})
        },
        blockTag
      ],
      id: 1
    });

    if (!response.result) {
      client.logger.error(
        "Unexpected no access list returned from eth_createAccessList"
      );
      return;
    }

    prefetchStorageFromAccessList(client, response.result).catch((error) => {
      client.logger.error(
        { error },
        "Error during storage prefetching after first storage request",
      );
    });
  };
};
