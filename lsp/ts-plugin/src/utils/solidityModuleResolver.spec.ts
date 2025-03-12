import { createRequire } from 'node:module'
import path from 'node:path'
import typescript from 'typescript/lib/tsserverlibrary.js'
import { describe, expect, it, vi } from 'vitest'
import { solidityModuleResolver } from './solidityModuleResolver.js'

// Mock for typescript.resolveModuleName
const createMockTs = (resolvedModule: any = undefined) => {
	return {
		...typescript,
		resolveModuleName: vi.fn().mockReturnValue({ resolvedModule }),
	}
}

describe('solidityModuleResolver', () => {
	it('should resolve relative solidity modules', () => {
		const result = solidityModuleResolver('./module.sol', typescript, {} as any, '/path/to/file.sol')
		expect(result).toEqual({
			extension: typescript.Extension.Dts,
			isExternalLibraryImport: false,
			resolvedFileName: path.resolve('/path/to', './module.sol'),
		})
	})

	it('should resolve solidity modules', () => {
		const result = solidityModuleResolver(
			'@openzeppelin/contracts/token/ERC20/ERC20.sol',
			typescript,
			{} as any,
			__dirname,
		)?.resolvedFileName.replace(path.join(__dirname, '..', '..', '..', '..'), '')
		expect(result).toMatchInlineSnapshot(
			`"/node_modules/.pnpm/@openzeppelin+contracts@5.2.0/node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol"`,
		)
	})

	it('should return undefined for non-solidity modules', () => {
		const result = solidityModuleResolver('module.js', typescript, {} as any, '/path/to/file.js')
		expect(result).toBeUndefined()
	})

	it('should return undefined for relative non-solidity modules', () => {
		const result = solidityModuleResolver('module.js', typescript, {} as any, './path/to/file.js')
		expect(result).toBeUndefined()
	})

	// Testing @tevm/contract handling
	it('should handle @tevm/contract imports with successful resolution', () => {
		const mockResolvedModule = {
			resolvedFileName: '/path/to/node_modules/@tevm/contract/index.d.ts',
		}
		const mockTs = createMockTs(mockResolvedModule)
		const mockCreateInfo = {
			project: {
				getCompilerOptions: () => ({}),
			},
		}

		const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

		const result = solidityModuleResolver('@tevm/contract', mockTs, mockCreateInfo as any, '/path/to/file.ts')

		expect(mockTs.resolveModuleName).toHaveBeenCalledWith(
			'@tevm/contract',
			'/path/to/file.ts',
			{},
			mockCreateInfo.project,
		)

		expect(result).toEqual({
			extension: typescript.Extension.Dts,
			isExternalLibraryImport: true,
			resolvedFileName: '/path/to/node_modules/@tevm/contract/index.d.ts',
		})

		consoleSpy.mockRestore()
	})

	it('should handle @tevm/contract imports with compiler options', () => {
		const mockResolvedModule = {
			resolvedFileName: '/path/to/node_modules/@tevm/contract/index.d.ts',
		}
		const mockTs = createMockTs(mockResolvedModule)
		const mockCreateInfo = {
			project: {
				getCompilerOptions: () => ({
					baseUrl: '/custom/path',
					paths: { '@tevm/*': ['./packages/*'] },
				}),
			},
		}

		const result = solidityModuleResolver('@tevm/contract', mockTs, mockCreateInfo as any, '/path/to/file.ts')

		expect(mockTs.resolveModuleName).toHaveBeenCalledWith(
			'@tevm/contract',
			'/path/to/file.ts',
			{ baseUrl: '/custom/path', paths: { '@tevm/*': ['./packages/*'] } },
			mockCreateInfo.project,
		)

		expect(result).toEqual({
			extension: typescript.Extension.Dts,
			isExternalLibraryImport: true,
			resolvedFileName: '/path/to/node_modules/@tevm/contract/index.d.ts',
		})
	})

	it('should handle @tevm/contract/subpath imports', () => {
		const mockResolvedModule = {
			resolvedFileName: '/path/to/node_modules/@tevm/contract/subpath/index.d.ts',
		}
		const mockTs = createMockTs(mockResolvedModule)
		const mockCreateInfo = {
			project: {
				getCompilerOptions: () => ({}),
			},
		}

		const result = solidityModuleResolver('@tevm/contract/subpath', mockTs, mockCreateInfo as any, '/path/to/file.ts')

		expect(result).toEqual({
			extension: typescript.Extension.Dts,
			isExternalLibraryImport: true,
			resolvedFileName: '/path/to/node_modules/@tevm/contract/subpath/index.d.ts',
		})
	})

	it('should handle unresolvable @tevm/contract imports', () => {
		const mockTs = createMockTs(undefined) // No resolved module
		const mockCreateInfo = {
			project: {
				getCompilerOptions: () => ({}),
			},
		}

		const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

		const result = solidityModuleResolver('@tevm/contract', mockTs, mockCreateInfo as any, '/path/to/file.ts')

		expect(mockTs.resolveModuleName).toHaveBeenCalled()
		expect(consoleSpy).toHaveBeenCalled()
		expect(result).toBeUndefined()

		consoleSpy.mockRestore()
	})
})
