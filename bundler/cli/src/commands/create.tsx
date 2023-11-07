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
import { exec } from 'child_process'
import { promisify } from 'util'
import { mainSymbols } from 'figures'
import Spinner from 'ink-spinner';

const execPromise = promisify(exec)

type PackageManager = "npm" | "pnpm" | "yarn" | "bun";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export const fixturesDir = join(__dirname, '..', '..', 'fixtures')

// Originally from https://github.com/t3-oss/create-t3-app/blob/main/cli/src/utils/getUserPkgManager.ts
const getUserPkgManager: () => PackageManager = () => {
	// This environment variable is set by npm and yarn but pnpm seems less consistent
	const userAgent = process.env['npm_config_user_agent'];

	if (userAgent) {
		if (userAgent.startsWith("yarn")) {
			return "yarn";
		} else if (userAgent.startsWith("pnpm")) {
			return "pnpm";
		} else if (userAgent.startsWith("bun")) {
			return "bun";
		} else {
			return "npm";
		}
	} else {
		// If no user agent is set, assume npm
		return "npm";
	}
};

function useCounter(n: number) {
	const [count, setCount] = useState(0)
	useEffect(() => {
		const intervalId = setInterval(() => {
			setCount((currentCount) => currentCount + 1)
		}, 50)
		return () => clearInterval(intervalId)
	}, [count, n])
	return { count, isRunning: count < n }
}

export const args = z.tuple([
	z
		.string()
		.optional()
		.default('my-evmts-app')
		.describe(
			'The name of the application, as well as the name of the directory to create',
		),
])

export const isDefault = true

const templates = [
	'bun-ethers',
	'bun-viem',
	'next-wagmi',
	'remix-wagmi',
	'mud',
	'mud-react',
] as const

export const options = z.object({
	noGit: z
		.boolean()
		.default(false)
		.describe('Skips initializing a new git repo in the project'),
	noInstall: z
		.boolean()
		.default(false)
		.describe("Skips running the package manager's install command"),
	default: z
		.boolean()
		.default(false)
		.describe('Bypass CLI and use all default options'),
	template: z
		.enum(templates)
		.default('remix-wagmi')
		.describe('template to use'),
})

type Props = {
	options: z.infer<typeof options>
	args: z.infer<typeof args>
}

const nameStep = {
	prompt: 'What is the name of your project?',
	stateKey: 'name' as const,
} as const
const templateStep = {
	prompt: 'Which template do you wish to use',
	stateKey: 'template' as const,
	choices: templates.map((template) => ({ label: template, value: template })),
} as const
const gitStep = {
	prompt: 'Do you want to initialize a git repo?',
	stateKey: 'noGit' as const,
	choices: [
		{ label: 'yes', value: true },
		{ label: 'no', value: false },
	],
}
const installStep = {
	prompt: 'Do you want to install dependencies?',
	stateKey: 'noInstall' as const,
	choices: [
		{ label: 'yes', value: true },
		{ label: 'no', value: false },
	],
}

const steps = [nameStep, templateStep, gitStep, installStep] as const

type State = {
	name?: string
} & z.infer<typeof options>

const titleText = 'Create EVMts App'

const create = async (
	state: State,
	setPackageManager: (pm: PackageManager) => void,
	onSuccessfulScaffold: () => void,
	installingPackagesStarted: () => void,
	onSuccessfulInstall: () => void,
	onError: (e: unknown) => void,
) => {
	try {
		const appPath = process.cwd() + '/' + state.name
		const packageManger = state.template.includes('bun') ? 'bun' : getUserPkgManager()
		setPackageManager(packageManger)
		const fixturePath = join(fixturesDir, state.template)
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
			await execPromise(`${packageManger} install`, { cwd: appPath })
			onSuccessfulInstall()
		}
	} catch (e) {
		onError(e)
	}
}

const Create: React.FC<Props> = ({ options, args }) => {
	useEffect(() => {
		// console.clear()
	}, [])
	const [state, setState] = useState<Partial<State>>({})
	const [packageManager, setPackageManager] = useState<PackageManager>()
	const currentStep = steps.find((step) => !state[step.stateKey])
	const [stepIndex, setStepIndex] = useState(
		options.default ? 100 : currentStep ? steps.indexOf(currentStep) : 0,
	)
	const goToNextStep = () => {
		const nextStep = stepIndex + 1
		setStepIndex(nextStep)
	}
	const animationSpeed = 1
	const { count: i, isRunning } = useCounter(
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
			<Gradient name='pastel'>
				<BigText font="tiny" text={titleText.slice(0, i + 1)} />
			</Gradient>
			{!isRunning && (
				<>
					<Box minHeight={3} flexDirection='column'>
						<Box flexDirection='row' gap={2}>
							<Text bold color='black' backgroundColor='#A7DBAB'>
								{'    Name   '}
							</Text>
							<Text>{nameStep.prompt}</Text>
						</Box>
						<Box paddingLeft={13}>{nameResult}</Box>
					</Box>
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
