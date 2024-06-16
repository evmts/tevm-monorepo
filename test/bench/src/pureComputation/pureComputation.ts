import { createMemoryClient } from 'tevm'
import { Fibonacci } from './fib.s.sol'
import { FibTs } from './fibts.js'

export const tevm = createMemoryClient()

/**
 * Tests fib sequence in solidity
 */
export const pureComputationSol = async (i: bigint): Promise<bigint> => {
	return tevm.tevmContract(Fibonacci.read.calculate(i)).then((res) => res.data) as Promise<bigint>
}
/**
 * Tests fib sequence in ts
 *
 */
export const pureComputationTs = (i: bigint): bigint => {
	const fib = new FibTs()
	return fib.calculate(i)
}
