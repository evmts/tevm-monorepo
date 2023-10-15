import { solidityModuleResolver } from './solidityModuleResolver.js'
import path from 'path'
import typescript from 'typescript/lib/tsserverlibrary.js'
import { describe, expect, it } from 'vitest'

describe('solidityModuleResolver', () => {
	it('should resolve relative solidity modules', () => {
		const result = solidityModuleResolver(
			'./module.sol',
			typescript,
			{} as any,
			'/path/to/file.sol',
		)
		expect(result).toEqual({
			extension: typescript.Extension.Dts,
			isExternalLibraryImport: false,
			resolvedFileName: path.resolve('/path/to', './module.sol'),
		})
	})
	it('should resolve solidity modules', () => {
		const result = solidityModuleResolver(
			'module.sol',
			typescript,
			{} as any,
			'/path/to/file.sol',
		)
		expect(result).toEqual({
			extension: typescript.Extension.Dts,
			isExternalLibraryImport: false,
			resolvedFileName: 'module.sol',
		})
	})
	it('should return undefined for non-solidity modules', () => {
		const result = solidityModuleResolver(
			'module.js',
			typescript,
			{} as any,
			'/path/to/file.js',
		)
		expect(result).toBeUndefined()
	})
	it('should return undefined for relative non-solidity modules', () => {
		const result = solidityModuleResolver(
			'module.js',
			typescript,
			{} as any,
			'./path/to/file.js',
		)
		expect(result).toBeUndefined()
	})
})
