import type { Store } from '../state/Store.js'
import { wait } from '../utils/wait.js'
import { useCopy } from './useCopy.js'
import { useCreateDir } from './useCreateDir.js'
import { useExec } from './useExec.js'
import { useMutation } from '@tanstack/react-query'
import { basename, dirname, join } from 'path'
import { useEffect, useMemo } from 'react'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const fixturesDir = join(__dirname, '..', '..', 'fixtures')

export const useCreateEvmtsApp = (state: Store): any => {
	const appPath = join(process.cwd(), basename(state.name))
	const fixturePath = join(fixturesDir, `${state.framework}/`)

	const createFixturesMutation = useCreateDir(
		appPath,
		async () => {
			copyTemplateMutation.mutate()
		},
		1000,
	)
	const copyTemplateMutation = useCopy(
		fixturePath,
		appPath,
		async () => {
			if (!state.noGit) {
				gitInitMutation.mutate()
			} else if (!state.noInstall) {
				installDependenciesMutation.mutate()
			} else {
				goToNextPageMutation.mutate()
			}
		},
		1000,
	)
	const gitInitMutation = useExec(
		'git',
		appPath,
		['init'],
		async () => {
			if (!state.noInstall) {
				installDependenciesMutation.mutate()
			} else {
				goToNextPageMutation.mutate()
			}
		},
		1000,
	)
	const installDependenciesMutation = useExec(
		state.packageManager,
		appPath,
		['install'],
		async () => {
			state.goToNextPage({})
		},
	)
	const goToNextPageMutation = useMutation({
		mutationFn: async () => {
			// wait before going to next page
			await wait(1000)
			state.goToNextPage({})
		},
	})

	useEffect(() => {
		createFixturesMutation.mutate()
	}, [])

	return useMemo(() => {
		const mutations = []
		mutations.push(createFixturesMutation)
		mutations.push(copyTemplateMutation)
		if (!state.noGit) {
			mutations.push(gitInitMutation)
		}
		if (!state.noInstall) {
			mutations.push(installDependenciesMutation)
		}
		mutations.push(goToNextPageMutation)

		// don't count the go to next step mutation
		const length = mutations.length - 1
		const isFailure = mutations.some((mutation) => mutation.isError)
		const errors = mutations
			.map((mutation) =>
				typeof mutation.error === 'string'
					? mutation.error
					: mutation.error?.message,
			)
			.filter(Boolean)
		const isComplete = mutations.every((mutation) => mutation.isSuccess)
		// don't count the go to next step mutation
		const settled = Math.min(
			length,
			mutations.filter((mutation) => mutation.isError || mutation.isSuccess)
				.length,
		)
		const currentMutation = mutations[settled]

		let output: { stdout: string; stderr: string } | {} = {}
		if (currentMutation && 'stdout' in currentMutation) {
			output = {
				stdout: currentMutation.stdout,
				stderr: currentMutation.stderr,
			}
		}

		const debugState = {
			createFixture: {
				isSuccess: createFixturesMutation.isSuccess,
				data: createFixturesMutation.data,
				loading: createFixturesMutation.isPending,
				error: createFixturesMutation.error,
			},
			copyTemplate: {
				isSuccess: copyTemplateMutation.isSuccess,
				data: copyTemplateMutation.data,
				loading: copyTemplateMutation.isPending,
				error: copyTemplateMutation.error,
			},
			gitInit: {
				isSuccess: gitInitMutation.isSuccess,
				data: gitInitMutation.data,
				loading:
					gitInitMutation.isPending &&
					!gitInitMutation.isError &&
					!gitInitMutation.isSuccess,
				error: gitInitMutation.error,
			},
			installDependencies: {
				isSuccess: installDependenciesMutation.isSuccess,
				data: installDependenciesMutation.data,
				loading:
					installDependenciesMutation.isPending &&
					!installDependenciesMutation.isError &&
					!installDependenciesMutation.isSuccess,
				error: installDependenciesMutation.error,
			},
			goToNextPage: {
				isSuccess: goToNextPageMutation.isSuccess,
				data: goToNextPageMutation.data,
				loading: goToNextPageMutation.isPending,
				error: goToNextPageMutation.error,
			},
		}

		return {
			debugState,
			errors,
			output,
			length,
			settled,
			isFailure,
			isComplete,
			currentMutation,
			createFixturesMutation,
			copyTemplateMutation,
			gitInitMutation,
			installDependenciesMutation,
			goToNextPageMutation,
		}
	}, [
		createFixturesMutation,
		copyTemplateMutation,
		gitInitMutation,
		installDependenciesMutation,
	])
}
