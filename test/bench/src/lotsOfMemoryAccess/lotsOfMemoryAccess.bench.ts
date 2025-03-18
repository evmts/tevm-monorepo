import { transports } from "@tevm/test-utils";
import { bench, describe, expect, beforeEach, afterEach } from "vitest";
import { spawn } from "child_process";
import { createPublicClient, http } from "viem";
import {
  lotsOfMemoryAccess,
  lotsOfMemoryAccessAnvil,
} from "./lotsOfMemoryAccess.js";

describe('import("@tevm/memory-client").createMemoryClient().contract - lotsOfMemoryAccess', async () => {
  let anvilProcess: ReturnType<typeof spawn>;

  const waitForAnvil = async () => {
    const client = createPublicClient({
      transport: http("http://localhost:8545"),
    });

    let retries = 50;
    while (retries > 0) {
      try {
        await client.getBlockNumber();
        return true;
      } catch (e) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        retries--;
      }
    }
    throw new Error("Anvil failed to start");
  };

  beforeEach(async () => {
    anvilProcess = spawn("anvil", [], {
      stdio: "ignore",
    });
    await waitForAnvil();
  });

  afterEach(() => {
    if (anvilProcess) {
      anvilProcess.kill("SIGINT");
    }
  });

  bench(
    "initialize a brand new tevm client and then execute a call with lots of storage requirements. This is similar to how one might use tevm in a serverless function where tevm is reinitialized often",
    async () => {
      const { data, rawData } = await lotsOfMemoryAccess(transports.optimism);
      expect({ data, rawData }).toMatchSnapshot();
    },
  );
  bench(
    "initialize a brand new anvil client and then execute a call with lots of storage requirements. This is similar to how one might use tevm in a serverless function where tevm is reinitialized often",
    async () => {
      expect(await lotsOfMemoryAccessAnvil()).toEqual(undefined);
    },
  );
});
