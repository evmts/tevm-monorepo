import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { access, mkdir, readFile, stat, writeFile } from 'node:fs/promises'
import { type MockedFunction, describe, expect, it, vi } from 'vitest'
import { fao } from './fao.js'

vi.mock('node:fs', async () => ({
	...((await vi.importActual('node:fs')) as {}),
	existsSync: vi.fn(),
	mkdirSync: vi.fn(),
	readFileSync: vi.fn(),
	statSync: vi.fn(),
	writeFileSync: vi.fn(),
}))

vi.mock('node:fs/promises', async () => ({
	...((await vi.importActual('node:fs/promises')) as {}),
	access: vi.fn(),
	mkdir: vi.fn(),
	readFile: vi.fn(),
	stat: vi.fn(),
	writeFile: vi.fn(),
}))

describe('File Access Object (fao)', () => {
	const mockExistsSync = existsSync as MockedFunction<typeof existsSync>
	const mockMkdirSync = mkdirSync as MockedFunction<typeof mkdirSync>
	const mockReadFileSync = readFileSync as MockedFunction<typeof readFileSync>
	const mockStatSync = statSync as MockedFunction<typeof statSync>
	const mockWriteFileSync = writeFileSync as MockedFunction<typeof writeFileSync>

	const mockAccess = access as MockedFunction<typeof access>
	const mockMkdir = mkdir as MockedFunction<typeof mkdir>
	const mockReadFile = readFile as MockedFunction<typeof readFile>
	const mockStat = stat as MockedFunction<typeof stat>
	const mockWriteFile = writeFile as MockedFunction<typeof writeFile>

	it('should check if a file exists synchronously', () => {
		mockExistsSync.mockReturnValueOnce(true)
		expect(fao.existsSync('path/to/file')).toBe(true)
		expect(mockExistsSync).toHaveBeenCalledWith('path/to/file')
	})

	it('should read a file synchronously', () => {
		const mockData = 'file content'
		mockReadFileSync.mockReturnValueOnce(mockData)
		expect(fao.readFileSync('path/to/file', 'utf8')).toBe(mockData)
		expect(mockReadFileSync).toHaveBeenCalledWith('path/to/file', 'utf8')
	})

	it('should write a file synchronously', () => {
		const mockData = 'file content'
		fao.writeFileSync('path/to/file', mockData)
		expect(mockWriteFileSync).toHaveBeenCalledWith('path/to/file', mockData)
	})

	it('should get file statistics synchronously', () => {
		const mockStats = {}
		mockStatSync.mockReturnValueOnce(mockStats as any)
		expect(fao.statSync('path/to/file')).toBe(mockStats)
		expect(mockStatSync).toHaveBeenCalledWith('path/to/file')
	})

	it('should create a directory synchronously', () => {
		fao.mkdirSync('path/to/dir')
		expect(mockMkdirSync).toHaveBeenCalledWith('path/to/dir')
	})

	it('should check if a file exists asynchronously', async () => {
		mockAccess.mockResolvedValueOnce(undefined)
		const result = await fao.exists('path/to/file')
		expect(result).toBe(true)
		expect(mockAccess).toHaveBeenCalledWith('path/to/file')
	})

	it('should return false if a file does not exist asynchronously', async () => {
		mockAccess.mockRejectedValueOnce(new Error('File does not exist'))
		const result = await fao.exists('path/to/file')
		expect(result).toBe(false)
		expect(mockAccess).toHaveBeenCalledWith('path/to/file')
	})

	it('should read a file asynchronously', async () => {
		const mockData = 'file content'
		mockReadFile.mockResolvedValueOnce(Buffer.from(mockData))
		const result = await fao.readFile('path/to/file', 'utf8')
		expect(result.toString()).toBe(mockData)
		expect(mockReadFile).toHaveBeenCalledWith('path/to/file', 'utf8')
	})

	it('should write a file asynchronously', async () => {
		const mockData = 'file content'
		await fao.writeFile('path/to/file', mockData)
		expect(mockWriteFile).toHaveBeenCalledWith('path/to/file', mockData)
	})

	it('should get file statistics asynchronously', async () => {
		const mockStats = {}
		mockStat.mockResolvedValueOnce(mockStats as any)
		const result = await fao.stat('path/to/file')
		expect(result).toBe(mockStats)
		expect(mockStat).toHaveBeenCalledWith('path/to/file')
	})

	it('should create a directory asynchronously', async () => {
		await fao.mkdir('path/to/dir')
		expect(mockMkdir).toHaveBeenCalledWith('path/to/dir')
	})
})
