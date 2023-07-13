import { handleEtherscan } from './etherscan'
import { EVMtsConfig } from '@evmts/config'
import { etherscan } from '@wagmi/cli/plugins'
import * as fs from 'fs'
import * as path from 'path'
import { Mock, afterEach, beforeEach, expect, test, vi } from 'vitest'

let externalContracts: Required<EVMtsConfig['externalContracts']>
let originalCwd: () => string
let writeFileMocked: Mock
let etherscanMocked: Mock

beforeEach(() => {
	externalContracts = {
		out: 'out',
		contracts: [],
		apiKeys: { etherscan: {} },
	}

	originalCwd = process.cwd
	process.cwd = () => path.resolve('/mocked/path')

	writeFileMocked = vi.fn()
	etherscanMocked = vi.fn()

	// Mock writeFile from fsPromises
	vi.mock('fs', () => ({
		writeFileSync: vi.fn(),
	}))
	writeFileMocked = vi.mocked(fs.writeFileSync)

	// Mock etherscan
	vi.mock('@wagmi/cli/plugins', () => ({
		etherscan: vi.fn(),
	}))
	etherscanMocked = vi.mocked(etherscan)
	etherscanMocked.mockReturnValue({
		validate: () => Promise.resolve(),
		run: () =>
			Promise.resolve({
				prepend: 'prepend',
				imports: 'imports',
				content: 'content',
			}),
	})
})

afterEach(() => {
	process.cwd = originalCwd
})

test('should throw an error if no etherscan api key for given chainId', async () => {
	if (!externalContracts) throw new Error('externalContracts is not defined')
	externalContracts.contracts = [
		{ type: 'etherscan', name: 'MockContract', addresses: { 1: '0x123' } },
	]
	await expect(
		handleEtherscan({ externalContracts } as any),
	).rejects.toThrowErrorMatchingInlineSnapshot(
		'"No etherscan api key for chainId 1 in etherscan plugin at externalContracts.apiKeys.etherscan.1. Please configure an apiKey"',
	)
})

test('should write the result from etherscan plugin to file', async () => {
	if (!externalContracts) throw new Error('externalContracts is not defined')
	externalContracts.contracts = [
		{ type: 'etherscan', name: 'MockContract', addresses: { 1: '0x123' } },
	]
	externalContracts.apiKeys.etherscan[1] = 'api-key'
	await handleEtherscan({ externalContracts } as any)
	expect(writeFileMocked.mock.calls).toMatchInlineSnapshot(`
    [
      [
        "/mocked/path/out",
        "
    imports
    content",
      ],
    ]
  `)
	expect(etherscanMocked.mock.calls).toMatchInlineSnapshot(`
    [
      [
        {
          "apiKey": "api-key",
          "chainId": 1,
          "contracts": [
            {
              "addresses": {
                "1": "0x123",
              },
              "name": "MockContract",
              "type": "etherscan",
            },
          ],
        },
      ],
    ]
  `)
})
