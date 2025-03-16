// Import vitest properly
import { describe, expect, it, vi } from 'vitest'

// Mock the compileContractSync function
vi.mock('@tevm/compiler', () => {
	return {
		compiler: {
			compileContractSync: vi.fn(function mockCompileContractSync() {
				// Mock ABI for a Counter contract
				const abi = [
					{
						name: 'increment',
						type: 'function',
						inputs: [],
						outputs: [],
						stateMutability: 'nonpayable',
					},
					{
						name: 'count',
						type: 'function',
						inputs: [],
						outputs: [{ type: 'uint256', name: '' }],
						stateMutability: 'view',
					},
				]

				// Return a mock contract object
				return {
					abi,
					bytecode: '0x123456',
					contract: {
						abi,
						bytecode: '0x123456',
						read: { count: vi.fn() },
						write: { increment: vi.fn() },
					},
				}
			}),
		},
	}
})

// Import the compiler module after mocking
import * as compilerModule from '@tevm/compiler'
// Import sol after mocking
import { sol } from '../index.js'

describe('sol template tag', () => {
	it('should compile a simple Solidity contract', () => {
		const Counter = sol`
      pragma solidity ^0.8.19;
      
      contract Counter {
        uint256 private count = 0;
        
        function increment() public {
          count += 1;
        }
        
        function count() public view returns (uint256) {
          return count;
        }
      }
    `

		// Verify the compiled contract has the expected properties
		expect(Counter).toBeDefined()
		expect(Counter.abi).toBeDefined()
		expect(Counter.bytecode).toBeDefined()
		expect(Counter.read).toBeDefined()
		expect(Counter.write).toBeDefined()

		// Check that the ABI contains the expected functions
		const abiNames = Counter.abi.map((item: any) => item.name).filter(Boolean)
		expect(abiNames).toContain('increment')
		expect(abiNames).toContain('count')

		// Verify the compileContractSync was called
		expect(compilerModule.compiler.compileContractSync).toHaveBeenCalled()
	})

	it('should handle template literals with expressions', () => {
		const name = 'CustomCounter'
		const initialValue = 42

		const CustomCounter = sol`
      pragma solidity ^0.8.19;
      
      contract ${name} {
        uint256 private count = ${initialValue};
        
        function increment() public {
          count += 1;
        }
        
        function count() public view returns (uint256) {
          return count;
        }
      }
    `

		// The contract should compile successfully
		expect(CustomCounter).toBeDefined()
		expect(CustomCounter.abi).toBeDefined()
		expect(CustomCounter.bytecode).toBeDefined()

		// Verify the compileContractSync was called
		expect(compilerModule.compiler.compileContractSync).toHaveBeenCalled()
	})
})
