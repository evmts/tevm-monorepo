import { Box, Text, useApp } from 'ink'
import BigText from 'ink-big-text'
import Gradient from 'ink-gradient'
import SelectInput from 'ink-select-input'
import TextInput from 'ink-text-input'
import React from 'react'
import { useEffect, useState } from 'react'
import { z } from 'zod'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url';
import fs from 'fs-extra'
import { mainSymbols } from 'figures'
import Spinner from 'ink-spinner';
import { generateRandomName } from '../utils/generateRandomName.js'
import { frameworks, linters, nameStep, packageManagers, solidityFrameworks, steps, testFrameworks, useCases } from '../utils/MultipleChoice.js'
import { getUserPkgManager, type PackageManager } from '../utils/getUserPkgManager.js'
import { execPromise } from '../utils/execPromise.js'
import { createStore } from 'zustand'
import { useCounter } from '../hooks/useCounter.js'
import { FancyCreateTitle } from '../components/FancyCreateTitle.js'
import { Step } from '../components/Step.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const fixturesDir = join(__dirname, '..', '..', 'fixtures')

export const isDefault = true
export const args = z.tuple([
	z
		.string()
		.optional()
		.default(generateRandomName())
		.describe(
			'The name of the application, as well as the name of the directory to create',
		),
])
export const options = z.object({
	default: z
		.boolean()
		.default(false)
		.describe('Bypass CLI and use all default options'),
	packageManager: z
		.enum([packageManagers.pnpm.value, packageManagers.npm.value, packageManagers.bun.value, packageManagers.yarn.value])
		.default(getUserPkgManager())
		.describe('JS package manager to use'),
	useCase: z
		.enum([useCases.simple.value, useCases.ui.value, useCases.server.value, useCases.scripting.value])
		.default(useCases.ui.value)
		.describe('Use case for app'),
	framework: z
		.enum([frameworks.simple.value, frameworks.mud.value, frameworks.server.value, frameworks.pwa.value, frameworks.next.value, frameworks.remix.value, frameworks.astro.value, frameworks.svelte.value, frameworks.vue.value, frameworks.bun.value, frameworks.elysia.value, frameworks.htmx.value])
		.default(frameworks.mud.value)
		.describe('Framework to use'),
	linter: z
		.enum([linters.eslintPrettier.value, linters.biome.value, linters.none.value])
		.default(linters.biome.value)
		.describe('Linter to use'),
	testFrameworks: z
		.enum([testFrameworks.vitest.value, testFrameworks.none.value])
		.default(testFrameworks.vitest.value),
	solidityFramework: z
		.enum([solidityFrameworks.foundry.value, solidityFrameworks.hardhat.value, solidityFrameworks.evmts.value])
		.default(solidityFrameworks.hardhat.value),
	noGit: z
		.boolean()
		.default(false)
		.describe('Skips initializing a new git repo in the project'),
	noInstall: z
		.boolean()
		.default(false)
		.describe("Skips running the package manager's install command"),
})

type Props = {
	options: z.infer<typeof options>
	args: z.infer<typeof args>
}
type State = {
	name?: string
} & z.infer<typeof options>
type Reducers = {}

const useStore = (initialState: State) => {
	const [store] = useState(createStore<State & Reducers>(() => {
		return initialState
	}))
	return store
}


const create = async (
	state: State,
	onSuccessfulScaffold: () => void,
	installingPackagesStarted: () => void,
	onSuccessfulInstall: () => void,
	onError: (e: unknown) => void,
) => {
	try {
		const appPath = process.cwd() + '/' + state.name
		const fixturePath = join(fixturesDir, state.framework)
		if (await fs.exists(appPath)) {
			throw new Error(`Directory ${appPath} already exists`)
		}
		await fs.mkdir(appPath)
		await fs.copy(fixturePath, appPath)
		onSuccessfulScaffold()
		if (!state.noGit) {
			await execPromise('git init', { cwd: appPath })
		}
		if (!state.noInstall) {
			installingPackagesStarted()
			await execPromise(`${state.packageManager} install`, { cwd: appPath })
			onSuccessfulInstall()
		}
		if (state.linter !== 'biome') {
			// add biome to dev deps
			// add linter scripts
			// add biome config
			// run linter
		}
		if (state.linter !== 'eslint-prettier') {
			// add eslint-prettier to dev deps
			// add linter scripts
			// add eslint-prettier config
			// run linter
		}
		if (state.testFrameworks === 'vitest') {
			// read package.json
			const pkgPath = join(appPath, 'package.json')
			const pkg = await fs.readJSON(pkgPath)
			// add vitest to devDependencies
			pkg.devDependencies = {
				...pkg.devDependencies,
				"@vitest/coverage-v8": "^0.34.6",
				"@vitest/ui": "^0.34.6",
				"vitest": "^0.34.6"
			}
			// add vitest scripts to scripts
			pkg.scripts = {
				...pkg.scripts,
				"test": "vitest --coverage",
				"test:coverage": "vitest run --coverage",
				"test:run": "vitest run",
				"test:ui": "vitest --ui"
			}
		}
	} catch (e) {
		onError(e)
	}
}

const Create: React.FC<Props> = ({ options, args: [defaultName] }) => {
	const store = useStore({ ...options, name: defaultName })
	const state = store.getState()
	const setState = store.setState
	const [packageManager, setPackageManager] = useState<PackageManager>()
	const animationSpeed = 1
	const { count: i } = useCounter(
		titleText.length / animationSpeed,
	)

	let nameResult = <></>
	if (stepIndex === 0) {
		nameResult = (
			<TextInput
				onSubmit={(value) => {
					setState({ ...state, name: value })
					goToNextStep()
				}}
				placeholder={args[0]}
				value={state.name ?? ''}
				onChange={(name) => {
					setState({ ...state, name })
				}}
			/>
		)
	} else {
		nameResult = <Text>{state.name}</Text>
	}

	let templateResult = <></>
	if (stepIndex === 1) {
		templateResult = (
			<SelectInput
				itemComponent={({ label, isSelected }) => {
					return <Text color={isSelected ? '#A4DDED' : 'white'}>{label}</Text>
				}}
				indicatorComponent={({ isSelected }) => <Box marginRight={1}>
					{isSelected ? (
						<Text color="#B19CD9">{mainSymbols.pointer}</Text>
					) : (
						<Text> </Text>
					)}
				</Box>}
				items={[...templateStep.choices]}
				onSelect={(template) => {
					goToNextStep()
					setState({
						template: template.value,
						default: state.default ?? options.default,
						name: state.name ?? args[0],
						noGit: state.noGit ?? options.noGit,
						noInstall: state.noInstall ?? options.noInstall,
					})
				}}
			/>
		)
	} else {
		templateResult = <Text>{state.template}</Text>
	}

	let gitResult = <></>
	if (stepIndex === 2) {
		gitResult = (
			<SelectInput
				items={[...gitStep.choices]}
				onSelect={(noGit) => {
					goToNextStep()
					setState({ ...state, noGit: noGit.value })
				}}
			/>
		)
	} else {
		gitResult = <Text>{state.noGit ? 'yes' : 'no'}</Text>
	}

	let installResult = <></>
	const onSuccessfulScaffold = () => {
		setSuccessfulScaffold(true)
	}
	const installingPackagesStarted = () => {
		setInstallingPackages(true)
	}
	const onSuccessfulInstall = () => {
		setSuccessfulInstall(true)
	}
	const onError = (e: unknown) => {
		setUnsuccessfulInstall(e as Error)
	}

	const [successfulScaffold, setSuccessfulScaffold] = useState(false)
	const [installingPackages, setInstallingPackages] = useState(false)
	const [successfulInstall, setSuccessfulInstall] = useState(false)
	const [unsuccessfulInstall, setUnsuccessfulInstall] = useState<Error>()
	if (stepIndex === 3) {
		installResult = (
			<SelectInput
				items={[...installStep.choices]}
				onSelect={(noInstall) => {
					setState({ ...state, noInstall: noInstall.value })
					goToNextStep()
					create({
						name: state.name || args[0],
						default: options.default,
						noGit: state.noGit ?? options.noGit,
						noInstall: state.noInstall ?? options.noInstall,
						template: state.template ?? options.template,
					}, setPackageManager, onSuccessfulScaffold, installingPackagesStarted, onSuccessfulInstall, onError)
				}}
			/>
		)
	}

	const { exit } = useApp()
	useEffect(() => {
		if (successfulInstall) {
			setTimeout(exit, 1)
			return
		}
		if (unsuccessfulInstall) {
			setTimeout(() => exit(unsuccessfulInstall), 1)
			return
		}
		if (options.default) {
			create({
				name: state.name || args[0],
				default: options.default,
				noGit: state.noGit ?? options.noGit,
				noInstall: state.noInstall ?? options.noInstall,
				template: state.template ?? options.template,
			}, setPackageManager, onSuccessfulScaffold, installingPackagesStarted, onSuccessfulInstall, onError)
			return
		}
		return
	}, [unsuccessfulInstall, successfulInstall, options.default])

	return (
		<>
			<FancyCreateTitle />
			{(
				<>
					<Step name="Name" prompt={nameStep.prompt}>
						{nameResult}
					</ Step>
					{stepIndex >= 1 && (
						<Box minHeight={3} flexDirection='column'>
							<Box flexDirection='row' gap={2}>
								<Text bold color='black' backgroundColor='#B19CD9'>
									{' Template  '}
								</Text>
								<Text>{templateStep.prompt}</Text>
							</Box>
							<Box paddingLeft={13}>{templateResult}</Box>
						</Box>
					)}
					{stepIndex >= 2 && (
						<Box minHeight={3} flexDirection='column'>
							<Box flexDirection='row' gap={2}>
								<Text bold color='black' backgroundColor='#F8CA4D'>
									{'    Git    '}
								</Text>
								<Text>{gitStep.prompt}</Text>
							</Box>
							<Box paddingLeft={13}>{gitResult}</Box>
						</Box>
					)}
					{stepIndex >= 3 && (
						<Box minHeight={3} flexDirection='column'>
							<Box flexDirection='row' gap={2}>
								<Text bold color='black' backgroundColor='#F78F8F'>
									{'  Install  '}
								</Text>
								<Text>{installStep.prompt}</Text>
							</Box>
							<Box paddingLeft={13}>{installResult}</Box>
						</Box>
					)}
					{stepIndex >= 4 && (
						<Box minHeight={3} flexDirection='column'>
							<Box flexDirection='row' gap={2}>
								<Text bold color='black' backgroundColor={successfulScaffold ? '#77dd77' : '#a6dcef'}>
									{!successfulScaffold && <Spinner type="dots" />}
									{' Creating  '}
								</Text>
								<Text>
									{`${successfulScaffold ? 'Scaffolding' : 'Scaffolded'} ${state.template ?? options.template} in ./${state.name || args[0]} with ${packageManager}`}
								</Text>
							</Box>
						</Box>
					)}
					{installingPackages && (
						<Box minHeight={3} flexDirection='column'>
							<Box flexDirection='row' gap={2}>
								<Text bold color='black' backgroundColor={successfulInstall ? '#77dd77' : '#a6dcef'}>
									{!successfulInstall && !unsuccessfulInstall && <Spinner type="dots" />}
									{'Installing '}
								</Text>
								<Text>
									{`${successfulScaffold ? 'Installing' : 'Installed'} with ${packageManager}`}
								</Text>
							</Box>
						</Box>
					)}
					{successfulInstall && (
						<Box minHeight={3} flexDirection='column'>
							<Box flexDirection='row' gap={2}>
								<Text bold color='black' backgroundColor={successfulInstall ? '#77dd77' : '#a6dcef'}>
									{' Success '}
								</Text>
								<Text>
									{`cd ${state.name || args[0]} && ${packageManager} run dev`}
								</Text>
							</Box>
						</Box>
					)}
					{unsuccessfulInstall && (
						<Box minHeight={3} flexDirection='column'>
							<Box flexDirection='row' gap={2}>
								<Text bold color='black' backgroundColor={"red"}>
									{' Failure  '}
								</Text>
								<Text color="red">
									{unsuccessfulInstall.message}
								</Text>
							</Box>
						</Box>
					)}
				</>
			)}
		</>
	)
}

export default Create
