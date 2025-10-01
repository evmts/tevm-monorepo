import { Box, useInput } from 'ink'

import type { Store } from '../state/Store.js'
import { MultipleChoiceStep } from './MultipleChoiceStep.js'
import { TextInputStep } from './TextInputStep.js'

type Props = {
	defaultName: string
	store: Store
}

export const InteractivePrompt: React.FC<Props> = ({ defaultName, store }) => {
	useInput((_, { leftArrow }) => {
		if (leftArrow) {
			store.goToPreviousStep({})
		}
	})

	const steps: React.ReactNode[] = []

	steps.push(
		<TextInputStep
			key="name"
			name="Name"
			isActive={store.currentStep === steps.length}
			color="#A4DDED"
			step={{
				type: 'input',
				prompt: 'What is the name of your project?',
				stateKey: 'name',
			}}
			value={store.nameInput}
			placeholder={defaultName}
			onChange={(value: string) => {
				store.setInput({ input: 'nameInput', value })
			}}
			onSubmit={(value: string) => {
				store.selectAndContinue({ name: 'name', value: value || defaultName })
			}}
		/>,
	)

	steps.push(
		<MultipleChoiceStep
			key="template"
			name="Template"
			isActive={store.currentStep === steps.length}
			hide={store.currentStep < steps.length}
			color="#B19CD9"
			multipleChoice={{
				type: 'multiple-choice',
				prompt: 'Pick a template',
				stateKey: 'framework',
				choices: {
					hardhat: { value: 'hardhat', label: 'Hardhat - Popular Ethereum development environment' },
					foundry: { value: 'foundry', label: 'Foundry - Fast, portable and modular toolkit' },
				},
			}}
			selectedChoice={store.framework}
			onSelect={(value: string) => {
				store.selectAndContinue({
					name: 'framework',
					value,
					nextPage: true,
				})
			}}
		/>,
	)

	return <Box flexDirection="column">{...steps}</Box>
}
