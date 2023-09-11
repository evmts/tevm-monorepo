import type { Artifacts } from '../solc/resolveArtifactsSync'
import { generateEvmtsBody } from './generateEvmtsBody'
import { generateRuntimeSync } from './generateRuntimeSync'
import { defaultConfig } from '@evmts/config'
import {
	type MockedFunction,
	beforeEach,
	describe,
	expect,
	it,
	vi,
} from 'vitest'

vi.mock('./generateEvmtsBody', () => ({ generateEvmtsBody: vi.fn() }))
const mockGenerateEvmtsBody = generateEvmtsBody as MockedFunction<
	typeof generateEvmtsBody
>

const mockLogger = { ...console, warn: vi.fn() }

describe('generateRuntimeSync', () => {
	const artifacts: Artifacts = {
		MyContract: {
			abi: [{ type: 'constructor', inputs: [], stateMutability: 'payable' }],
			userdoc: {
				kind: 'user',
				version: 1,
				notice: 'MyContract',
				methods: {
					'balanceOf(address)': {
						notice: 'Returns the amount of tokens owned by account',
					},
				},
			},
		},
	}
	const config = defaultConfig

	beforeEach(() => {
		vi.clearAllMocks()
	})

	it('should throw an error for unknown module types', () => {
		expect(() =>
			generateRuntimeSync(artifacts, config, 'invalidType' as any, mockLogger),
		).toThrowErrorMatchingInlineSnapshot('"Unknown module type: invalidType"')
	})

	it('should handle no artifacts found case', () => {
		expect(generateRuntimeSync({}, config, 'cjs', mockLogger)).toEqual('')
		expect(mockLogger.warn).toHaveBeenCalledWith(
			'No artifacts found, skipping runtime generation',
		)
	})

	it('should handle artifacts being null', () => {
		expect(generateRuntimeSync(null as any, config, 'cjs', mockLogger)).toEqual(
			'',
		)
		expect(mockLogger.warn).toHaveBeenCalledWith(
			'No artifacts found, skipping runtime generation',
		)
	})

	it('should handle commonjs module type', () => {
		mockGenerateEvmtsBody.mockReturnValue('mockedBody')
		const result = generateRuntimeSync(artifacts, config, 'cjs', mockLogger)
		expect(result).toMatchInlineSnapshot(`
      "const { evmtsContractFactory } = require('@evmts/core')
      mockedBody"
    `)
	})

	it('should handle dts module type', () => {
		mockGenerateEvmtsBody.mockReturnValue('mockedBody')
		const result = generateRuntimeSync(artifacts, config, 'dts', mockLogger)
		expect(result).toMatchInlineSnapshot(`
      "import { EvmtsContract } from '@evmts/core'
      mockedBody"
    `)
	})

	it('should handle ts module type', () => {
		mockGenerateEvmtsBody.mockReturnValue('mockedBody')
		const result = generateRuntimeSync(artifacts, config, 'ts', mockLogger)
		expect(result).toMatchInlineSnapshot(`
      "import { evmtsContractFactory } from '@evmts/core'
      mockedBody"
    `)
	})

	it('should handle mjs module type', () => {
		mockGenerateEvmtsBody.mockReturnValue('mockedBody')
		const result = generateRuntimeSync(artifacts, config, 'mjs', mockLogger)
		expect(result).toMatchInlineSnapshot(`
      "import { evmtsContractFactory } from '@evmts/core'
      mockedBody"
    `)
	})
})
