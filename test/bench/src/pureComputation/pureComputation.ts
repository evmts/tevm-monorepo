import {
  createMemoryClient,
  encodeFunctionData,
  hexToBigInt,
  type Hex,
} from "tevm";
import { Fibonacci } from "./fib.s.sol";
import { FibTs } from "./fibts.js";
import { createTevmEvm } from "@tevm/revm";

export const tevm = createMemoryClient();
export const wasmEvm = createTevmEvm();

/**
 * Tests fib sequence in solidity
 */
export const pureComputationSol = async (i: bigint): Promise<bigint> => {
  return tevm
    .tevmContract({
      ...Fibonacci.read.calculate(i),
      deployedBytecode: Fibonacci.deployedBytecode,
    })
    .then((res) => res.data) as Promise<bigint>;
};
/**
 * Tests fib sequence in ts
 *
 */
export const pureComputationTs = (i: bigint): bigint => {
  const fib = new FibTs();
  return fib.calculate(i);
};

export const pureComputationWasmRevm = (
  i: bigint,
  address: Hex,
): Promise<bigint> => {
  return wasmEvm
    .call({
      to: address,
      data: encodeFunctionData(Fibonacci.read.calculate(i)),
      from: `0x${"00".repeat(20)}`,
      gasLimit: "121000",
      value: "0x",
    })
    .then((res) => hexToBigInt(res.returnValue as Hex));
};
