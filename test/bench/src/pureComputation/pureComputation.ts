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
  to: Hex,
  from: Hex,
): Promise<bigint> => {
  return wasmEvm
    .call({
      to,
      from,
      data: encodeFunctionData(Fibonacci.read.calculate(i)),
      gasLimit: "200000",
      value: "0",
    })
    .then((res) => {
      console.log(res);
      return res;
    })
    .then((res) =>
      res.returnValue === "0x" ? 0n : hexToBigInt(res.returnValue as Hex),
    )
    .catch((e) => {
      console.error(e);
      throw e;
    });
};
