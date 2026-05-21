import { type ChildProcessWithoutNullStreams, spawn } from 'node:child_process'
import { Box, Text } from 'ink'
import Spinner from 'ink-spinner'
import { option } from 'pastel'
import { useEffect, useRef, useState } from 'react'
import zod from 'zod'

// Add command description for help output
export const description = "Compile TypeScript files with TEVM's TypeScript plugin"

export const options = zod.object({
	watch: zod.boolean().describe(
		option({
			description: 'Watch for changes',
			alias: 'w',
		}),
	),
	project: zod
		.string()
		.optional()
		.describe(
			option({
				description: 'Path to tsconfig.json',
			}),
		),
	noEmit: zod.boolean().describe(
		option({
			description: 'Do not emit outputs',
			alias: 'n',
		}),
	),
})

type Props = {
	options: zod.infer<typeof options>
}

type TscState = {
	status: 'running' | 'done' | 'error'
	lines: string[]
	exitCode?: number
}

export default function Tsc({ options }: Props) {
	const [state, setState] = useState<TscState>({ status: 'running', lines: [] })
	const processRef = useRef<ChildProcessWithoutNullStreams | null>(null)

	useEffect(() => {
		const args: string[] = []
		if (options.project) {
			args.push('--project', options.project)
		}
		if (options.watch) {
			args.push('--watch')
		}
		if (options.noEmit) {
			args.push('--noEmit')
		}

		const command = process.platform === 'win32' ? 'tsc.cmd' : 'tsc'
		const child = spawn(command, args)
		processRef.current = child

		const appendOutput = (data: Buffer) => {
			const text = data.toString()
			if (text.length === 0) {
				return
			}
			setState((current) => ({ ...current, lines: [...current.lines, text] }))
		}

		child.stdout.on('data', appendOutput)
		child.stderr.on('data', appendOutput)
		child.on('error', (error) => {
			process.exitCode = 1
			setState((current) => ({ status: 'error', lines: [...current.lines, error.message], exitCode: 1 }))
		})
		child.on('exit', (code) => {
			const exitCode = code ?? 1
			if (exitCode !== 0) {
				process.exitCode = exitCode
			}
			setState((current) => ({
				status: exitCode === 0 ? 'done' : 'error',
				lines: current.lines,
				exitCode,
			}))
		})

		return () => {
			processRef.current?.kill()
			processRef.current = null
		}
	}, [options.noEmit, options.project, options.watch])

	const output = state.lines.join('').trim()

	if (state.status === 'running') {
		return (
			<Box flexDirection="column">
				<Text>
					<Spinner type="dots" /> Running TypeScript compiler...
				</Text>
				{output ? <Text>{output}</Text> : null}
			</Box>
		)
	}

	return (
		<Box flexDirection="column">
			{output ? <Text>{output}</Text> : null}
			<Text color={state.status === 'done' ? 'green' : 'red'}>
				TypeScript compiler {state.status === 'done' ? 'completed' : `failed with exit code ${state.exitCode ?? 1}`}
			</Text>
		</Box>
	)
}
