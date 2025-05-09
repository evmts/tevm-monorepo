import { createMemoryClient } from "tevm";
import { http } from "tevm";
import { optimism } from "tevm/common";
import type { MemoryClient } from "tevm";

export const createRefreshClient = ({ common, fork, refreshInterval = 2000}: {
  common: typeof optimism;
  fork: {
    transport: ReturnType<typeof http>;
  };
  refreshInterval?: number;
}) => {
  let currentClient = createMemoryClient({
    common,
    fork,
  });

  setInterval(async () => {
    const newClient = createMemoryClient({
      common,
      fork,
    });
    await newClient.tevmReady();
    currentClient = newClient;
  }, refreshInterval);

  return new Proxy(currentClient, {
    get(_, prop) {
      return Reflect.get(currentClient, prop);
    }
  }) as MemoryClient;
};
