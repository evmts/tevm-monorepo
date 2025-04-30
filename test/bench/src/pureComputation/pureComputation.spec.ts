import { test, describe, expect, beforeAll } from "vitest";
import {
  pureComputationSol,
  pureComputationTs,
  pureComputationWasmRevm,
  tevm,
  wasmEvm,
} from "./pureComputation.js";
import { Fibonacci } from "./fib.s.sol";

// Verification value for Fibonacci(10)
const FIB_10 = 55n;
// Verification value for Fibonacci(200)
const FIB_200 = 280571172992510140037611932413038677189525n;

const caller = "0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
const address = `0x${"21".repeat(20)}` as const;
beforeAll(async () => {
  await wasmEvm.init();
  await wasmEvm.setAccountCode(address, Fibonacci.deployedBytecode);
  await tevm.tevmReady();
});

describe("Testing pure computation fib(10)", () => {
  beforeAll(async () => {
    await wasmEvm.init();
    await wasmEvm.setAccountBalance(caller, "10000000000000000000");
    await wasmEvm.setAccountCode(address, Fibonacci.deployedBytecode);
    await tevm.tevmReady();
  });

  test("Fibonacci(10) using Rust/WASM REVM", async () => {
    expect(await pureComputationWasmRevm(10n, address, caller)).toEqual(FIB_10);
  });
  test("Fibonacci(10) using JavaScript EVM", async () => {
    expect(await pureComputationSol(10n)).toEqual(FIB_10);
  });
  test("Fibonacci(10) using pure TypeScript", () => {
    expect(pureComputationTs(10n)).toEqual(FIB_10);
  });
});
describe("Testing pure computation fib(200)", () => {
  const address = `0x${"21".repeat(20)}` as const;

  test("Fibonacci(200) using Rust/WASM REVM", async () => {
    expect(await pureComputationWasmRevm(200n, address, caller)).toEqual(
      FIB_200,
    );
  });
  test("Fibonacci(200) using JavaScript EVM", async () => {
    expect(await pureComputationSol(200n)).toEqual(FIB_200);
  });
  test("Fibonacci(200) using pure TypeScript", () => {
    expect(pureComputationTs(200n)).toEqual(FIB_200);
  });
});
