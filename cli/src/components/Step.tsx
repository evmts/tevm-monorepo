import { Box, Text } from 'ink'
import React from 'react'

export type StepProps = {
	isActive?: boolean
	activeContent: React.ReactNode
	nonActiveContent: React.ReactNode
	name: string
	prompt: string
	color: string
	hide?: boolean
}

const DEFAULT_DESIRED_WIDTH = 16

const formatName = (name: string, desiredWidth = DEFAULT_DESIRED_WIDTH) => {
	const leftWidth = Math.floor((desiredWidth - name.length) / 2)
	const rightWidth = Math.ceil((desiredWidth - name.length) / 2)
	return ' '.repeat(leftWidth) + name + ' '.repeat(rightWidth)
}

export const Step: React.FC<StepProps> = ({
	hide = false,
	isActive,
	activeContent,
	nonActiveContent,
	name,
	color,
	prompt,
}) => {
	if (hide) {
		return null
	}

	return (
		<Box minHeight={3} flexDirection="column">
			<Box flexDirection="row" gap={2}>
				<Text bold color="black" backgroundColor={color}>
					{formatName(name)}
				</Text>
				<Text>{prompt}</Text>
			</Box>
			<Box paddingLeft={18}>{isActive ? activeContent : nonActiveContent}</Box>
		</Box>
	)
}
