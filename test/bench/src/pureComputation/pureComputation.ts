import { Fibonacci } from './fib.s.sol'
import { FibTs } from './fibts.js'
import { createMemoryClient } from 'tevm'

export const tevm = createMemoryClient()

/**
 * Tests fib sequence in solidity
 */
export const pureComputationSol = async (i: bigint): Promise<bigint> => {
	return tevm
		.script(Fibonacci.read.calculate(i))
		.then((res) => res.data) as Promise<bigint>
}
/**
 * Tests fib sequence in ts
 *
 */
export const pureComputationTs = (i: bigint): bigint => {
	const fib = new FibTs()
	return fib.calculate(i)
}
