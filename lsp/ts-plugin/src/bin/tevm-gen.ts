#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { access, mkdir, readFile, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { bundler, type FileAccessObject } from '@tevm/base-bundler'
import { createCache } from '@tevm/bundler-cache'
import { loadConfig } from '@tevm/config'
import { runSync } from 'effect/Effect'
import { glob } from 'glob'
import * as solc from 'solc'

const fao: FileAccessObject = {
	existsSync: existsSync,
	readFile: readFile,
	readFileSync: readFileSync,
	writeFileSync: writeFileSync,
	statSync,
	stat,
	mkdirSync,
	mkdir,
	writeFile,
	exists: async (path: string) => {
		try {
			await access(path)
			return true
		} catch (_e) {
			return false
		}
	},
}

/**
 * Displays the help information for the tevm-gen CLI tool.
 * Shows usage instructions and available command line options.
 */
const showHelp = () => {
	console.log(`
Usage: tevm-gen [cwd] [include]
Description:
  Generates TypeScript type definitions for Solidity contracts.

Arguments:
  cwd             Working directory (defaults to current directory)
  include         Glob pattern(s) for Solidity files, comma-separated (defaults to 'src/**/*.sol')

Options:
  -h, --help      Show this help message and exit
`)
}

/**
 * Generates TypeScript type definitions for Solidity contracts.
 *
 * This function:
 * 1. Finds all Solidity files matching the include patterns
 * 2. Loads the Tevm configuration from the working directory
 * 3. Creates a bundler cache to speed up compilation
 * 4. For each Solidity file, generates TypeScript type definitions
 * 5. Writes the generated TypeScript files alongside the Solidity files
 *
 * @param {string} cwd - The working directory to use as the base for file resolution
 * @param {string[]} include - Array of glob patterns to match Solidity files
 * @throws {Error} If no matching files are found
 */
const generate = (cwd = process.cwd(), include = ['src/**/*.sol']) => {
	console.log('Generating types from contracts...', { dir: cwd, include })
	const files = glob.sync(include, {
		cwd,
	})
	if (files.length === 0) {
		throw new Error('No files found')
	}
	files.forEach(async (file) => {
		const fileName = file.split('/').at(-1) as string
		const fileDir = file.split('/').slice(0, -1).join('/')
		const config = runSync(loadConfig(cwd))
		const solcCache = createCache(config.cacheDir, fao, cwd)
		const plugin = bundler(config, console, fao, solc, solcCache, '@tevm/contract')
		plugin
			.resolveTsModule(`./${file}`, cwd, false, true)
			.then((tsContent) => writeFile(path.join(fileDir, `${fileName}.ts`), tsContent.code))
	})
}

const args = process.argv.slice(2)

if (args.includes('-h') || args.includes('--help')) {
	showHelp()
	process.exit(0)
}

const [userCwd, userInclude] = args
const cwd = userCwd || process.cwd()
const include = userInclude ? userInclude.split(',') : ['src/**/*.sol']

generate(cwd, include)
