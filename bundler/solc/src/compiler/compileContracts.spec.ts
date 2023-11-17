import type { FileAccessObject } from '../types.js'
import { compileContract } from './compileContracts.js'
import type { ResolvedCompilerConfig } from '@evmts/config'
import { existsSync, readFileSync } from 'fs'
import { readFile } from 'fs/promises'
import { join } from 'path'
import { describe, expect, it, vi } from 'vitest'

const absolutePathContext = join(__dirname, '..', '..', '..', '..')

describe('compileContract', () => {
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
	}

	it('should successfully compile a contract without errors', async () => {
		const config: ResolvedCompilerConfig = {
			foundryProject: false,
			libs: [],
			remappings: {},
		}
		expect(
			JSON.stringify(
				await compileContract(
					'./Contract.sol',
					join(__dirname, '..', 'fixtures', 'basic'),
					config,
					false,
					false,
					fao,
					mockLogger,
				),
				null,
				2,
			).replaceAll(absolutePathContext, ''),
		).toMatchSnapshot()
	})
})
