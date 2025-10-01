import React from 'react'
import fs, { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { access, mkdir, readFile, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'
// Import required dependencies for Tevm bundler
import { bundler, type FileAccessObject } from '@tevm/base-bundler'
import { createCache } from '@tevm/bundler-cache'
import { loadConfig } from '@tevm/config'
import { runSync } from 'effect/Effect'
import { glob } from 'glob'
import { Box, Newline, Text } from 'ink'
import Spinner from 'ink-spinner'
import { argument, option } from 'pastel'
import { useEffect, useState } from 'react'
import * as solc from 'solc'
import zod from 'zod'

// Define FileAccessObject for use with the Tevm bundler
const fao: FileAccessObject = {
	existsSync,
	readFile,
	readFileSync,
	writeFileSync,
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

// Add command description for help output
export const description = 'Generate strongly typed TypeScript files from solidity contracts'

export const args = zod.tuple([
	zod.enum(['contract', 'test', 'script', 'all']).describe(
		argument({
			name: 'type',
			description: 'Type of file to generate (contract: generates TS types from .sol files)',
		}),
	),
	zod
		.string()
		.optional()
		.describe(
			argument({
				name: 'name',
				description: 'Name of the file or glob pattern',
			}),
		),
])

export const options = zod.object({
	force: zod
		.boolean()
		.default(false)
		.describe(
			option({
				description: 'Overwrite existing files',
				alias: 'f',
			}),
		),
	dir: zod
		.string()
		.default(process.cwd())
		.describe(
			option({
				description: 'Working directory (defaults to current directory)',
				alias: 'd',
			}),
		),
	include: zod
		.string()
		.default('src/**/*.sol')
		.describe(
			option({
				description: 'Glob pattern(s) for Solidity files, comma-separated',
				alias: 'i',
			}),
		),
	output: zod
		.string()
		.optional()
		.describe(
			option({
				description: 'Custom output directory for generated files',
				alias: 'o',
			}),
		),
	verbose: zod
		.boolean()
		.default(false)
		.describe(
			option({
				description: 'Show verbose output',
				alias: 'v',
			}),
		),
})

type Props = {
	args: zod.infer<typeof args>
	options: zod.infer<typeof options>
}

export default function Generate({ args, options }: Props) {
	const [type, name] = args
	const [isGenerating, setIsGenerating] = useState(false)
	const [currentTask, setCurrentTask] = useState<string>('')
	const [result, setResult] = useState<{
		success: boolean
		files: string[]
		errors: string[]
	}>({ success: false, files: [], errors: [] })

	useEffect(() => {
		const generateTypes = async () => {
			setIsGenerating(true)

			try {
				// Handle different generation types
				if (type === 'contract') {
					await generateContractTypes()
				} else if (type === 'test') {
					// Implementation for test generation
					setResult({
						success: true,
						files: ['Test generation not yet implemented'],
						errors: [],
					})
				} else if (type === 'script') {
					// Implementation for script generation
					setResult({
						success: true,
						files: ['Script generation not yet implemented'],
						errors: [],
					})
				} else if (type === 'all') {
					await generateContractTypes()
					// Add other type generations as they are implemented
				}
			} catch (error) {
				setResult({
					success: false,
					files: [],
					errors: [error instanceof Error ? error.message : String(error)],
				})
			} finally {
				setIsGenerating(false)
				setCurrentTask('')
			}
		}

		const generateContractTypes = async () => {
			const cwd = options.dir
			const includePatterns = options.include.split(',')
			const errors: string[] = []
			const generatedFiles: string[] = []

			if (options.verbose) {
				console.log('Generating types from contracts...', { dir: cwd, include: includePatterns, name })
			}

			try {
				setCurrentTask('Searching for Solidity files...')
				let files = glob.sync(includePatterns, { cwd })

				// Filter files by name if provided
				if (name) {
					const namePattern = name.includes('*') ? name : `*${name}*`
					const nameRegex = new RegExp(namePattern.replace(/\*/g, '.*'))
					files = files.filter((file) => {
						const fileName = path.basename(file)
						return nameRegex.test(fileName)
					})
				}

				if (files.length === 0) {
					throw new Error(`No files found matching the provided patterns${name ? ` and name "${name}"` : ''}`)
				}

				setCurrentTask(`Found ${files.length} files. Starting type generation...`)

				// Process each file using the Tevm bundler
				for (let i = 0; i < files.length; i++) {
					const file = files[i]! // Non-null assertion as we're iterating within bounds
					setCurrentTask(`Processing file ${i + 1}/${files.length}: ${file}`)

					try {
						const fileName = path.basename(file)
						const fileDir = path.dirname(file)
						const outputPath = options.output
							? path.join(options.output, `${fileName}.ts`)
							: path.join(fileDir, `${fileName}.ts`)

						if (!options.force && fs.existsSync(outputPath)) {
							errors.push(`File already exists: ${outputPath}. Use --force to overwrite.`)
							continue
						}

						// Actual implementation using Tevm bundler
						try {
							setCurrentTask(`Loading config for ${fileName}...`)
							const config = runSync(loadConfig(cwd) as any)

							setCurrentTask(`Creating cache for ${fileName}...`)
							const solcCache = createCache((config as any).cacheDir, fao, cwd)

							setCurrentTask(`Bundling ${fileName}...`)
							const plugin = bundler(config as any, console, fao, solc, solcCache, 'tevm/contract')
							const tsContent = await plugin.resolveTsModule(`./${file}`, cwd, false, true)

							// Ensure directory exists
							const dir = path.dirname(outputPath)
							if (!fs.existsSync(dir)) {
								mkdirSync(dir, { recursive: true })
							}

							// Write the generated TypeScript file
							setCurrentTask(`Writing types to ${outputPath}...`)
							await writeFile(outputPath, tsContent.code)
							generatedFiles.push(outputPath)

							if (options.verbose) {
								console.log(`Generated: ${outputPath}`)
							}
						} catch (bundlerError) {
							const errorMessage = bundlerError instanceof Error ? bundlerError.message : String(bundlerError)
							errors.push(`Bundler error processing ${file}: ${errorMessage}`)
							// Log the full error in verbose mode for debugging
							if (options.verbose) {
								console.error(`Detailed error for ${file}:`, bundlerError)
							}
						}
					} catch (err) {
						errors.push(`Error processing ${file}: ${err instanceof Error ? err.message : String(err)}`)
					}
				}

				setResult({
					success: errors.length === 0,
					files: generatedFiles,
					errors,
				})
			} catch (err) {
				setResult({
					success: false,
					files: [],
					errors: [err instanceof Error ? err.message : String(err)],
				})
			}
		}

		generateTypes()
	}, [])

	if (isGenerating) {
		return (
			<Box flexDirection="column">
				<Box>
					<Text color="green">
						<Spinner type="dots" />
					</Text>
					<Text>
						{' '}
						Generating {type} {name ? `"${name}"` : 'files'}
						{options.force ? ' (force)' : ''}
					</Text>
				</Box>
				{currentTask && (
					<Box marginTop={1}>
						<Text dimColor>{currentTask}</Text>
					</Box>
				)}
			</Box>
		)
	}

	return (
		<Box flexDirection="column">
			{result.success ? (
				<>
					<Text color="green">Successfully generated {result.files.length} files:</Text>
					<Newline />
					{result.files.map((file, index) => (
						<Text key={index}>- {file}</Text>
					))}
				</>
			) : (
				<>
					<Text color="red">Generation failed with errors:</Text>
					<Newline />
					{result.errors.map((error, index) => (
						<Text key={index} color="red">
							- {error}
						</Text>
					))}
				</>
			)}
			{result.files.length > 0 && result.errors.length > 0 && (
				<>
					<Newline />
					<Text color="yellow">Completed with warnings:</Text>
					<Newline />
					{result.errors.map((error, index) => (
						<Text key={index} color="yellow">
							- {error}
						</Text>
					))}
				</>
			)}
		</Box>
	)
}
