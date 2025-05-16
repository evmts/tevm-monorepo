import type { Stash } from '@latticexyz/stash/internal';
import type { EthGetStorageAtJsonRpcRequest } from '@tevm/actions';
import type { MemoryClient } from '@tevm/memory-client';
import type { Address } from '@tevm/utils';

/**
   * Creates a decorator that extends a MemoryClient to intercept eth_getStorageAt requests to the MUD store,
   * retrieve the synced state directly and return the encoded value.
   *
   * This directly modifies the fork transport's request method to intercept specific RPC calls before they're sent to the forked chain.
   *
   * This is extremely ugly but returning a new forkTransport.request method doesn't seem to replace it.
   */
  export const mudStoreForkInterceptor =
    ({ stash, storeAddress }: { stash: Stash; storeAddress: Address }) =>
    (client: MemoryClient): any => {
      const logger = client.transport.tevm.logger
      // Skip if not in fork mode or fork transport doesn't exist
      if (!client.transport?.tevm?.forkTransport?.request) {
        logger.warn("No fork transport found - storage interceptor will have no effect");
        return {};
      }

      const originalForkRequest = client.transport.tevm.forkTransport.request;
      client.transport.tevm.forkTransport.request = function interceptedRequest(args,
  options) {
        if (
          args.method === 'eth_getStorageAt' &&
          args.params &&
          Array.isArray(args.params) &&
          args.params[0]?.toLowerCase() === storeAddress.toLowerCase()
        ) {
          const params = args.params as unknown as EthGetStorageAtJsonRpcRequest["params"]
          const [address, position, blockTag = 'latest'] = params

          logger.debug(`Intercepting MUD store storage access:`, {
            address,
            position,
            blockTag
          });

          try {
            // TODO: Implement actual stash lookup logic
            return originalForkRequest.call(this, args, options);
          } catch (error) {
            logger.error("Error in MUD storage interception:", error);
            return originalForkRequest.call(this, args, options);
          }
        }

        return originalForkRequest.call(this, args, options);
      };

      return {};
    };