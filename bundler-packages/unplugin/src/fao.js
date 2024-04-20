import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { access, mkdir, readFile, stat, writeFile } from 'node:fs/promises'
// @ts-expect-error
import defaultSolc from 'solc'

/**
 * @type {import("@tevm/base-bundler").FileAccessObject}
 */
export const fao = {
	existsSync,
	readFile,
	readFileSync,
	writeFileSync,
	statSync,
	stat,
	mkdirSync,
	writeFile,
	mkdir,
	exists: async (path) => {
		try {
			await access(path)
			return true
		} catch (e) {
			return false
		}
	},
}
