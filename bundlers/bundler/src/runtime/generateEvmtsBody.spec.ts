import { generateEvmtsBody } from './generateEvmtsBody' // replace with your actual module path
import { describe, expect, it } from 'vitest'

describe('generateEvmtsBody', () => {
	const artifacts = {
		MyContract: {
			abi: {},
			bytecode: '0x60016001',
		},
		AnotherContract: {
			abi: {},
			bytecode: '0x60016002',
		},
	}

	const contractFactory = 'ContractFactory'

	const config = {
		localContracts: {
			contracts: [
				{
					name: 'MyContract',
					addresses: {
						test: '0x123',
					},
				},
			],
		},
	}

	it('should generate correct body for cjs module', () => {
		const result = generateEvmtsBody(
			artifacts,
			contractFactory,
			config as any,
			'cjs',
		)
		expect(result).toMatchSnapshot()
	})

	it('should generate correct body for mjs module', () => {
		const result = generateEvmtsBody(
			artifacts,
			contractFactory,
			config as any,
			'mjs',
		)
		expect(result).toMatchSnapshot()
	})

	it('should generate correct body for ts module', () => {
		const result = generateEvmtsBody(
			artifacts,
			contractFactory,
			config as any,
			'ts',
		)
		expect(result).toMatchSnapshot()
	})
})
