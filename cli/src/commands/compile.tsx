import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { glob } from 'glob'
import { Box, Newline, Text } from 'ink'
import { option } from 'pastel'
import { useEffect, useState } from 'react'
import solc from 'solc'
import zod from 'zod'

// Add command description for help output
export const description = 'Compile Solidity smart contracts to bytecode and ABI'

export const options = zod.object({
	watch: zod
		.boolean()
		.default(false)
		.describe(
			option({
				description: 'Watch for changes',
				alias: 'w',
			}),
		),
	optimize: zod
		.boolean()
		.default(true)
		.describe(
			option({
				description: 'Enable optimizations',
				defaultValueDescription: 'true',
			}),
		),
	target: zod
		.enum(['es2015', 'es2020', 'esnext'])
		.default('es2020')
		.describe(
			option({
				description: 'Compilation target',
				defaultValueDescription: 'es2020',
			}),
		),
})

type Props = {
	options: zod.infer<typeof options>
}

type CompileState = {
	status: 'compiling' | 'done' | 'error'
	artifacts: string[]
	errors: string[]
}

export default function Compile({ options }: Props) {
	const [state, setState] = useState<CompileState>({ status: 'compiling', artifacts: [], errors: [] })

	useEffect(() => {
		const compileContracts = () => {
			const cwd = process.cwd()
			const files = glob.sync('src/**/*.sol', { cwd, nodir: true })

			if (files.length === 0) {
				setState({ status: 'error', artifacts: [], errors: ['No Solidity files found under src/**/*.sol'] })
				return
			}

			const sources = Object.fromEntries(
				files.map((file) => [
					file,
					{
						content: readFileSync(path.join(cwd, file), 'utf8'),
					},
				]),
			)
			const input = {
				language: 'Solidity',
				sources,
				settings: {
					optimizer: {
						enabled: options.optimize,
						runs: 200,
					},
					outputSelection: {
						'*': {
							'*': ['abi', 'evm.bytecode', 'evm.deployedBytecode'],
						},
					},
				},
			}
			const output = JSON.parse(solc.compile(JSON.stringify(input)))
			const errors = (output.errors ?? [])
				.filter((error: { severity?: string }) => error.severity === 'error')
				.map(
					(error: { formattedMessage?: string; message?: string }) =>
						error.formattedMessage ?? error.message ?? String(error),
				)

			if (errors.length > 0) {
				setState({ status: 'error', artifacts: [], errors })
				return
			}

			const artifactsDir = path.join(cwd, 'artifacts')
			const artifacts: string[] = []
			mkdirSync(artifactsDir, { recursive: true })

			for (const [sourceName, contracts] of Object.entries(output.contracts ?? {}) as Array<
				[string, Record<string, any>]
			>) {
				for (const [contractName, contract] of Object.entries(contracts)) {
					const artifactPath = path.join(artifactsDir, `${contractName}.json`)
					const bytecode = contract.evm?.bytecode?.object ? `0x${contract.evm.bytecode.object}` : '0x'
					const deployedBytecode = contract.evm?.deployedBytecode?.object
						? `0x${contract.evm.deployedBytecode.object}`
						: '0x'
					writeFileSync(
						artifactPath,
						`${JSON.stringify(
							{
								contractName,
								sourceName,
								abi: contract.abi ?? [],
								bytecode,
								deployedBytecode,
							},
							null,
							2,
						)}
`,
					)
					artifacts.push(path.relative(cwd, artifactPath))
				}
			}

			setState({ status: 'done', artifacts, errors: [] })
		}

		compileContracts()

		if (!options.watch) {
			return
		}

		const interval = setInterval(compileContracts, 1000)
		return () => clearInterval(interval)
	}, [options.optimize, options.watch])

	if (state.status === 'compiling') {
		return <Text>Compiling Solidity contracts...</Text>
	}

	if (state.status === 'error') {
		return (
			<Box flexDirection="column">
				<Text color="red">Compilation failed:</Text>
				<Newline />
				{state.errors.map((error, index) => (
					<Text key={index} color="red">
						- {error}
					</Text>
				))}
			</Box>
		)
	}

	return (
		<Box flexDirection="column">
			<Text color="green">Compiled {state.artifacts.length} artifacts:</Text>
			<Newline />
			{state.artifacts.map((artifact) => (
				<Text key={artifact}>- {artifact}</Text>
			))}
			{options.watch && <Text dimColor>Watching for changes...</Text>}
		</Box>
	)
}
