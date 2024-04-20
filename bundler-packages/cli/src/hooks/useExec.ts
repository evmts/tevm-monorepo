import { spawn } from 'node:child_process'
import { useEffect, useReducer, useState } from 'react'
import { wait } from '../utils/wait.js'

export const useExec = (command: string, cwd: string, args: any, onSuccess: () => void, withWait = 0) => {
	const [isStarted, mutate] = useReducer(() => true, false)
	const [output, setOutput] = useState('')
	const [error, setError] = useState('')
	const [exitCode, setExitCode] = useState<number>()
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (!isStarted) {
			return
		}
		const child = spawn(command, args, { cwd })
		child.stdout.on('data', (data) => {
			setOutput((prev) => prev + data.toString())
		})
		child.stderr.on('error', (data) => {
			setError((prev) => prev + data.toString())
		})
		child.stderr.on('data', (data) => {
			setError((prev) => prev + data.toString())
		})
		child.on('close', async (code) => {
			// slowing down how fast this resolves improves ux and makes it more clear what is happening
			await wait(withWait)
			setExitCode(code ?? 0)
			if (code === 0) {
				onSuccess()
			}
		})
	}, [command, ...args, isStarted])

	return {
		data: output,
		stdout: output,
		stderr: error,
		error,
		exitCode,
		mutate,
		isPending: isStarted && exitCode === undefined,
		isSuccess: exitCode === 0,
		isError: exitCode !== undefined && exitCode !== 0,
	}
}
