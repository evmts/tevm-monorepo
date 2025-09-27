import { Text } from 'ink'
import React from 'react'
import { SelectInput } from './SelectInput.js'
import { Step } from './Step.js'

type Choice = {
	label: string
	value: string
}

type MultipleChoice = {
	type: 'multiple-choice'
	prompt: string
	stateKey: string
	choices: Record<string, Choice>
}

type Props = {
	name: string
	isActive?: boolean
	hide?: boolean
	color: string
	multipleChoice: MultipleChoice
	selectedChoice: string
	onSelect: (value: string) => void
}

export const MultipleChoiceStep: React.FC<Props> = ({ multipleChoice, selectedChoice, onSelect, ...stepProps }) => {
	return (
		<Step
			{...stepProps}
			prompt={multipleChoice.prompt}
			nonActiveContent={<Text>{multipleChoice.choices[selectedChoice]?.label}</Text>}
			activeContent={
				<SelectInput
					items={Object.values(multipleChoice.choices)}
					onSelect={(choice) => {
						onSelect(choice.value)
					}}
				/>
			}
		/>
	)
}
