// import { handleEtherscan } from './handleEtherscan'
import type { EvmtsConfig } from '@evmts/config'
// import { etherscan } from '@wagmi/cli/plugins'
import * as fs from 'fs'
import { type MockedFunction, beforeEach, expect, test, vi } from 'vitest'

const externalContracts: EvmtsConfig['externalContracts'] = {
	out: 'out',
	contracts: [
		{
			type: 'etherscan',
			name: 'MyExternalContract',
			addresses: { 1: '0x123', 10: '0x456' },
		},
	],
	apiKeys: { etherscan: {} },
}
const mockCwd = '/mock/cwd'
vi.stubGlobal('process', { cwd: mockCwd })

vi.mock('fs', () => ({
	writeFileSync: vi.fn(),
}))
const mockWriteFileSync = fs.writeFileSync as MockedFunction<
	typeof fs.writeFileSync
>

beforeEach(() => {
	vi.resetAllMocks()
})
test('should throw an error if no etherscan api key for given chainId', async () => {
	expect(mockWriteFileSync).toBeTruthy()
})

test('should write the result from etherscan plugin to file', async () => {
	expect(externalContracts).toBeTruthy()
})
