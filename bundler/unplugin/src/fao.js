import {
	existsSync,
	mkdirSync,
	readFileSync,
	statSync,
	writeFileSync,
} from 'fs'
import { access, mkdir, readFile, writeFile } from 'fs/promises'
// @ts-expect-error
import defaultSolc from 'solc'

/**
 * @type {import("@tevm/base").FileAccessObject}
 */
export const fao = {
	existsSync,
	readFile,
	readFileSync,
	writeFileSync,
	statSync,
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
