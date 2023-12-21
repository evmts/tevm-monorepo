import { MultipleChoiceStep } from './components/MultipleChoiceStep.js'
import { TextInputStep } from './components/TextInputStep.js'
import * as inputSteps from './constants/InputStep.js'
import * as multipleChoiceSteps from './constants/MultipleChoice.js'
import { defaultWalletConnect } from './constants/defaults.js'
import { frameworksByUseCase } from './constants/frameworksByUseCase.js'
import { type Store } from './state/Store.js'
import { colorPallet } from './styles/colors.js'
import { useInput } from 'ink'
import React, { type ReactNode } from 'react'

type Props = {
	defaultName: string
	store: Store
}

// All colors but remove black
const colorsArray = Object.values(colorPallet).filter(
	(color) => color !== '#000000',
)

export const InteractivePrompt: React.FC<Props> = ({ defaultName, store }) => {
	useInput((_, { leftArrow }) => {
		if (leftArrow) {
			store.goToPreviousStep({})
		}
	})

	const steps: Array<ReactNode> = []

	steps.push(
		<TextInputStep
			name='Name'
			isActive={store.currentStep === steps.length}
			color={colorsArray[steps.length % colorsArray.length] as '#000000'}
			step={inputSteps.nameStep}
			value={store.nameInput}
			placeholder={defaultName}
			onChange={(value) => {
				store.setInput({ input: 'nameInput', value })
			}}
			onSubmit={(value) => {
				if (value === '') {
					store.selectAndContinue({ name: 'name', value: defaultName })
					return
				}
				store.selectAndContinue({ name: 'name', value })
			}}
		/>,
	)

	steps.push(
		<MultipleChoiceStep
			name='Use case'
			isActive={store.currentStep === steps.length}
			hide={store.currentStep < steps.length}
			color={colorsArray[steps.length % colorsArray.length] as '#000000'}
			multipleChoice={multipleChoiceSteps.useCases}
			selectedChoice={store.useCase}
			onSelect={(value) => {
				store.selectAndContinue({
					name: 'useCase',
					value: value,
				})
			}}
		/>,
	)

	steps.push(
		<MultipleChoiceStep
			name='Template'
			isActive={store.currentStep === steps.length}
			hide={store.currentStep < steps.length}
			color={colorsArray[steps.length % colorsArray.length] as '#000000'}
			multipleChoice={
				frameworksByUseCase[
					store.useCase
				] as unknown as typeof multipleChoiceSteps.frameworks
			}
			selectedChoice={store.framework}
			onSelect={(value) => {
				store.selectAndContinue({
					name: 'framework',
					value,
				})
			}}
		/>,
	)

	const isBun = store.framework.includes('bun')
	const isMud = store.framework.includes('mud')
	const isUi = Object.keys(frameworksByUseCase.ui.choices).includes(
		store.framework,
	)
	if (!isBun && !isMud) {
		steps.push(
			<MultipleChoiceStep
				name='Manager'
				isActive={store.currentStep === steps.length}
				hide={store.currentStep < steps.length}
				color={colorsArray[steps.length % colorsArray.length] as '#000000'}
				multipleChoice={multipleChoiceSteps.packageManagers}
				selectedChoice={store.packageManager}
				onSelect={(value) => {
					store.selectAndContinue({
						name: 'packageManager',
						value: value,
					})
				}}
			/>,
		)
	}

	//  if (!isMud) {
	//    steps.push(
	//      <MultipleChoiceStep
	//        name="Solidity"
	//        isActive={store.currentStep === steps.length}
	//        hide={store.currentStep < steps.length}
	//     color={colorsArray[steps.length % colorsArray.length] as '#000000'}
	//        multipleChoice={multipleChoiceSteps.solidityFrameworks}
	//        selectedChoice={store.solidityFramework}
	//        onSelect={(value) => {
	//          store.selectAndContinue({
	//            name: 'solidityFramework',
	//            value: value,
	//          })
	//        }}
	//      />)
	//  }

	//  if (!isMud) {
	//    steps.push(
	//      <MultipleChoiceStep
	//        name="Contracts"
	//        isActive={store.currentStep === steps.length}
	//        hide={store.currentStep < steps.length}
	//    color={colorsArray[steps.length % colorsArray.length] as '#000000'}
	//        multipleChoice={multipleChoiceSteps.contractStrategy}
	//        selectedChoice={store.contractStrategy}
	//        onSelect={(value) => {
	//          store.selectAndContinue({
	//            name: 'contractStrategy',
	//            value: value,
	//          })
	//        }}
	//      />)
	//  }

	if (!isMud) {
		steps.push(
			<MultipleChoiceStep
				name='TypeScript'
				isActive={store.currentStep === steps.length}
				hide={store.currentStep < steps.length}
				color={colorsArray[steps.length % colorsArray.length] as '#000000'}
				multipleChoice={multipleChoiceSteps.gitChoices}
				selectedChoice={store.noGit ? 'none' : 'git'}
				onSelect={(value) => {
					store.selectAndContinue({
						name: 'noGit',
						value: value === 'none' ? true : false,
					})
				}}
			/>,
		)
	}

	if (isUi && !isMud) {
		steps.push(
			<TextInputStep
				name='WalletConnect'
				isActive={store.currentStep === steps.length}
				hide={store.currentStep < steps.length}
				color={colorsArray[steps.length % colorsArray.length] as '#000000'}
				step={inputSteps.walletConnectProjectId}
				value={store.walletConnectIdInput}
				placeholder={defaultWalletConnect}
				onChange={(value) => {
					store.setInput({ input: 'walletConnectIdInput', value })
				}}
				onSubmit={(value) => {
					if (value === '') {
						store.selectAndContinue({
							name: 'walletConnectProjectId',
							value: defaultName,
						})
						return
					}
					store.selectAndContinue({ name: 'walletConnectProjectId', value })
				}}
			/>,
		)
	}

	//  if (!isMud && !isBun) {
	//    steps.push(
	//      <MultipleChoiceStep
	//        name="Test"
	//        isActive={store.currentStep === steps.length}
	//        hide={store.currentStep < steps.length}
	//        multipleChoice={multipleChoiceSteps.testFrameworks}
	//        selectedChoice={store.testFrameworks}
	//        onSelect={(value) => {
	//          store.selectAndContinue({
	//            name: 'testFrameworks',
	//            value: value,
	//          })
	//        }}
	//      />)
	//  }

	//  if (!isMud) {
	//    steps.push(
	//      <MultipleChoiceStep
	//        name="Linter"
	//        isActive={store.currentStep === steps.length}
	//        hide={store.currentStep < steps.length}
	//        multipleChoice={multipleChoiceSteps.linters}
	//        selectedChoice={store.linter}
	//        onSelect={(value) => {
	//          store.selectAndContinue({
	//            name: 'linter',
	//            value: value as string,
	//          })
	//        }}
	//      />)
	//  }

	//  steps.push(
	//    <MultipleChoiceStep
	//      name="Ci"
	//      isActive={store.currentStep === steps.length}
	//      hide={store.currentStep < steps.length}
	//      multipleChoice={multipleChoiceSteps.ciChoices}
	//      selectedChoice={store.ciChoice}
	//      onSelect={(value) => {
	//        store.selectAndContinue({
	//          name: 'ciChoice',
	//          value: value,
	//        })
	//      }}
	//    />
	//  )

	steps.push(
		<MultipleChoiceStep
			name='Git'
			isActive={store.currentStep === steps.length}
			hide={store.currentStep < steps.length}
			color={colorsArray[steps.length % colorsArray.length] as '#000000'}
			multipleChoice={multipleChoiceSteps.gitChoices}
			selectedChoice={store.noGit ? 'none' : 'git'}
			onSelect={(value) => {
				store.selectAndContinue({
					name: 'noGit',
					value: value === 'none' ? true : false,
				})
			}}
		/>,
	)

	steps.push(
		<MultipleChoiceStep
			name='Install'
			isActive={store.currentStep === steps.length}
			hide={store.currentStep < steps.length}
			color={colorsArray[steps.length % colorsArray.length] as '#000000'}
			multipleChoice={multipleChoiceSteps.installChoices}
			selectedChoice={store.noInstall ? 'none' : 'install'}
			onSelect={(value) => {
				store.selectAndContinue({
					name: 'noInstall',
					value: value === 'none' ? true : false,
					nextPage: true,
				})
			}}
		/>,
	)

	return <>{...steps}</>
}
