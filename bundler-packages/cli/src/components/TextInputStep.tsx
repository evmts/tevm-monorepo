import type { InputStep } from '../constants/index.js'
import { Step, type StepProps } from './Step.js'
import { Text } from 'ink'
import TextInput from 'ink-text-input'
import type { FC } from 'react'
import React from 'react'

type Props = Pick<StepProps, 'isActive' | 'hide' | 'color' | 'name'> & {
	step: InputStep
	value: string
	placeholder: string
	onSubmit: (value: string) => void
	onChange: (value: string) => void
}

export const TextInputStep: FC<Props> = ({
	step,
	value,
	placeholder,
	onSubmit,
	onChange,
	...stepProps
}) => {
	return (
		<Step
			{...stepProps}
			prompt={step.prompt}
			nonActiveContent={<Text>{value === '' ? placeholder : value}</Text>}
			activeContent={
				<TextInput
					placeholder={placeholder}
					value={value}
					onChange={onChange}
					onSubmit={onSubmit}
				/>
			}
		/>
	)
}
