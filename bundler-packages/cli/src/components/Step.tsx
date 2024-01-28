import { asyncStateColors, colorPallet } from '../styles/colors.js'
import { Box, Text } from 'ink'
import Spinner from 'ink-spinner'
import React from 'react'
import type { FC, ReactNode } from 'react'

type ValueOf<T> = T[keyof T]

export type StepProps = {
	isActive?: boolean
	activeContent: React.ReactNode
	nonActiveContent: React.ReactNode
	name: string
	prompt: string
	color: ValueOf<typeof colorPallet>
	icon?: ReactNode
	children?: never
	hide?: boolean
}

const DEFAULT_DESIRED_WIDTH = 16

const formatName = (name: string, desiredWidth = DEFAULT_DESIRED_WIDTH) => {
	const leftWidth = Math.floor((desiredWidth - name.length) / 2)
	const rightWidth = Math.ceil((desiredWidth - name.length) / 2)
	return ' '.repeat(leftWidth) + name + ' '.repeat(rightWidth)
}

export const Step: FC<StepProps> = ({
	hide = false,
	isActive,
	activeContent,
	nonActiveContent,
	name,
	color,
	icon,
	prompt,
}) => {
	if (hide) {
		return <></>
	}
	return (
		<Box minHeight={3} flexDirection='column'>
			<Box flexDirection='row' gap={2}>
				<Text bold color='black' backgroundColor={color}>
					{formatName(
						name,
						icon ? DEFAULT_DESIRED_WIDTH - 1 : DEFAULT_DESIRED_WIDTH,
					)}
				</Text>
				<Text>{prompt}</Text>
			</Box>
			<Box paddingLeft={18}>{isActive ? activeContent : nonActiveContent}</Box>
		</Box>
	)
}

export type AsyncStepState = 'loading' | 'error' | 'success'

export type AsyncStepProps = {
	name: string
	state: AsyncStepState
	prompt: string
	successMessage: string
	errorMessage: string
	loadingMessage: string
}

export const AsyncStep: FC<AsyncStepProps> = ({
	name,
	state,
	prompt,
	successMessage,
	loadingMessage,
	errorMessage,
}) => {
	return (
		<Step
			name={name}
			isActive={state === 'loading'}
			activeContent={
				state === 'loading' && (
					<Text color={colorPallet.blue}>{loadingMessage}</Text>
				)
			}
			nonActiveContent={[
				state === 'error' && (
					<Text color={colorPallet.red}>{errorMessage}</Text>
				),
				state === 'success' && (
					<Text color={colorPallet.green}>{successMessage}</Text>
				),
			]}
			color={asyncStateColors[state]}
			prompt={prompt}
			icon={state === 'loading' ? <Spinner type='dots' /> : undefined}
		/>
	)
}
