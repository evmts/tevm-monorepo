import { existsSync, readFileSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import type { ResolvedCompilerConfig } from '@tevm/config'
import { describe, expect, it, vi } from 'vitest'
import type { FileAccessObject } from '../types.js'
import { compileContractSync } from './compileContractsSync.js'

const absolutePathContext = join(__dirname, '..', '..', '..', '..')

describe('compileContractSync', () => {
	const mockLogger = {
		error: vi.fn(),
		warn: vi.fn(),
		info: vi.fn(),
		log: vi.fn(),
	}

	const fao: FileAccessObject = {
		existsSync,
		readFile,
		readFileSync,
		exists: vi.fn(),
	}

	it('should successfully compile a contract without errors', async () => {
		const config: ResolvedCompilerConfig = {
			cacheDir: '.tevm',
			foundryProject: false,
			libs: [],
			remappings: {},
		}
		expect(
			JSON.stringify(
				compileContractSync(
					'./Contract.sol',
					join(__dirname, '..', 'fixtures', 'basic'),
					config,
					false,
					false,
					fao,
					mockLogger,
					require('solc'),
				),
				null,
				2,
			).replaceAll(absolutePathContext, ''),
		).toMatchSnapshot()
	})
})
