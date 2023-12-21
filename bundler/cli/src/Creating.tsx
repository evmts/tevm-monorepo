import { type StepProps } from './components/Step.js'
import Table from './components/Table.js'
import { useCreateEvmtsApp } from './hooks/useCreateEvmtsApp.js'
import type { Store } from './state/Store.js'
import { asyncStateColors, colorPallet } from './styles/colors.js'
import { getTailLogs } from './utils/getTailLogs.js'
import { Box, Text } from 'ink'
import Spinner from 'ink-spinner'
import { relative } from 'path'
import React from 'react'

type Props = {
	store: Store
}

type AsyncState = 'idle' | 'pending' | 'success' | 'error'
type AsyncStep = {
	mutationState: AsyncState
	progressMessage: string
	error?: Error | string | null
} & Pick<StepProps, 'name' | 'prompt'>

const AsyncStep = ({
	name,
	error,
	prompt,
	mutationState,
	progressMessage,
}: AsyncStep) => {
	const icon = {
		idle: '🔵',
		pending: '🟡',
		success: '🟢',
		error: '🔴',
	}[mutationState]
	const errorMessage = typeof error === 'string' ? error : error?.message
	const promptColor = {
		idle: colorPallet.gray,
		pending: asyncStateColors.loading,
		success: colorPallet.white,
		error: asyncStateColors.error,
	}[mutationState]
	return (
		<Box flexDirection='column'>
			<Box flexDirection='row' gap={2}>
				<Text bold color={promptColor} dimColor={mutationState !== 'pending'}>
					{icon}
				</Text>
				<Text>{mutationState === 'pending' && <Spinner type='dots' />}</Text>
				<Text>{name}</Text>
				<Text>{prompt}</Text>
			</Box>
			<Text>{mutationState === 'pending' && getTailLogs(progressMessage)}</Text>
			<Text color={asyncStateColors.error}>
				{mutationState === 'error' && errorMessage}
			</Text>
		</Box>
	)
}

export const Creating: React.FC<Props> = ({ store }) => {
	const createState = useCreateEvmtsApp(store)
	const {
		createFixturesMutation: m0,
		copyTemplateMutation: m1,
		gitInitMutation: m2,
		installDependenciesMutation: m3,
	} = createState
	return (
		<Box display='flex' flexDirection='column'>
			<Table
				data={[
					{
						name: store.name,
						template: store.framework,
						node_modules: store.packageManager,
						path: relative(process.cwd(), store.path),
					},
				]}
			/>
			<Text>
				completed {createState.settled} of {createState.length} tasks
			</Text>
			<AsyncStep
				name='Init'
				mutationState={
					m0.isSuccess
						? 'success'
						: m0.isPending
						? 'pending'
						: m0.isError
						? 'error'
						: 'idle'
				}
				prompt={`mkdir ${store.path}`}
				progressMessage='Initializing project...'
				error={m0.error}
			/>
			<AsyncStep
				name='Scaffolding'
				mutationState={
					m1.isSuccess
						? 'success'
						: m1.isPending
						? 'pending'
						: m1.isError
						? 'error'
						: 'idle'
				}
				prompt={`Initialize ${store.framework}`}
				progressMessage='Copying template...'
				error={m1.error}
			/>
			<AsyncStep
				name='Git'
				mutationState={
					m2.isSuccess
						? 'success'
						: m2.isPending
						? 'pending'
						: m2.isError
						? 'error'
						: 'idle'
				}
				prompt='git init'
				progressMessage={m2.stderr || m2.stdout}
				error={m2.error}
			/>
			<AsyncStep
				name='Packages'
				mutationState={
					m3.isSuccess
						? 'success'
						: m3.isPending
						? 'pending'
						: m3.isError
						? 'error'
						: 'idle'
				}
				prompt={`Install ${store.packageManager} dependencies`}
				progressMessage={m3.stderr || m3.stdout}
				error={m3.error}
			/>
		</Box>
	)
}
