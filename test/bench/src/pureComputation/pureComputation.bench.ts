import { bench, describe, expect } from "vitest";
import {
  pureComputationSol,
  pureComputationTs,
  pureComputationWasmRevm,
  tevm,
  wasmEvm,
} from "./pureComputation.js";
import { Fibonacci } from "./fib.s.sol";

const FIB_200 = 280571172992510140037611932413038677189525n;

describe('import("@tevm/memory-client").createMemoryClient().script - pure computation no state access', async () => {
  // wait for tevm to initialize so we don't measure that
  await tevm.tevmReady();
  const address = `0x${"21".repeat(20)}` as const;
  await wasmEvm
    .init()
    .then(() => wasmEvm.setAccountCode(address, Fibonacci.deployedBytecode));
  bench("should do fibanci(420) computation in revm/wasm", async () => {
    expect(await pureComputationWasmRevm(200n, address)).toEqual(FIB_200);
  });
  bench("should do fibanci(420) computation in solidity", async () => {
    expect(await pureComputationSol(200n)).toEqual(FIB_200);
  });
  bench("should do fibanci(420) computation in typescript", async () => {
    expect(pureComputationTs(200n)).toEqual(FIB_200);
  });
});
