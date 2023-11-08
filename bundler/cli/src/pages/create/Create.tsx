import React from 'react'
import { z } from 'zod'
import { FancyCreateTitle } from '../../components/FancyCreateTitle.js'
import { chainIdsValidator, type options } from './options.js'
import type { args } from './args.js'
import { useStore } from './state/Store.js'
import { Box } from 'ink'
import * as inputSteps from './constants/InputStep.js'
import { colorPallet } from '../../styles/colors.js'
import * as multipleChoiceSteps from './constants/MultipleChoice.js'
import { frameworksByUseCase } from './constants/frameworksByUseCase.js'
import { MultipleChoiceStep } from '../../components/MultipleChoiceStep.js'
import { TextInputStep } from '../../components/TextInputStep.js'


const defaultChainIds = chainIdsValidator.parse(undefined)

type Props = {
  options: z.infer<typeof options>
  args: z.infer<typeof args>
}

export const Create: React.FC<Props> = ({ options, args: [defaultName] }) => {
  const store = useStore({
    ...options,
    name: defaultName,
    currentStep: 0,
    path: '.',
    nameInput: '',
    chainIdInput: '',
  })

  return (
    <Box display="flex" flexDirection="column">
      <FancyCreateTitle />
      <TextInputStep
        name="Name"
        isActive={store.currentStep === 0}
        color={colorPallet.purple}
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
      />
      <MultipleChoiceStep
        name="Use case"
        isActive={store.currentStep === 1}
        hide={store.currentStep < 1}
        color={colorPallet.purple}
        multipleChoice={multipleChoiceSteps.useCases}
        selectedChoice={store.useCase}
        onSelect={(value) => {
          store.selectAndContinue({
            name: 'useCase',
            value: value,
          })
        }}
      />
      <MultipleChoiceStep
        name="Template"
        isActive={store.currentStep === 2}
        hide={store.currentStep < 2}
        color={colorPallet.purple}
        multipleChoice={frameworksByUseCase[store.useCase] as typeof multipleChoiceSteps.frameworks}
        selectedChoice={store.framework}
        onSelect={(value) => {
          store.selectAndContinue({
            name: 'framework',
            value,
          })
        }}
      />
      <MultipleChoiceStep
        name="Manager"
        isActive={store.currentStep === 3}
        hide={store.currentStep < 3}
        color={colorPallet.purple}
        multipleChoice={multipleChoiceSteps.packageManagers}
        selectedChoice={store.packageManager}
        onSelect={(value) => {
          store.selectAndContinue({
            name: 'linter',
            value: value as string,
          })
        }}
      />
      <MultipleChoiceStep
        name="Solidity"
        isActive={store.currentStep === 4}
        hide={store.currentStep < 4}
        color={colorPallet.purple}
        multipleChoice={multipleChoiceSteps.solidityFrameworks}
        selectedChoice={store.solidityFramework}
        onSelect={(value) => {
          store.selectAndContinue({
            name: 'solidityFramework',
            value: value,
          })
        }}
      />
      <TextInputStep
        name="ChainIds"
        isActive={store.currentStep === 0}
        color={colorPallet.purple}
        step={inputSteps.chainIds}
        value={store.chainIdInput}
        placeholder={defaultChainIds.join(',')}
        onChange={(value) => {
          const parsedIds = chainIdsValidator.safeParse(value.endsWith(',') ? value.slice(0, value.length - 1) : value)
          if (!parsedIds.success) {
            return
          }
          store.setInput({ input: 'chainIdInput', value })
        }}
        onSubmit={(value) => {
          if (value === '') {
            store.selectAndContinue({ name: 'chainIds', value: defaultChainIds })
            return
          }
          const parsedIds = chainIdsValidator.safeParse(value.endsWith(',') ? value.slice(0, value.length - 1) : value)
          if (!parsedIds.success) {
            return
          }
          store.selectAndContinue({ name: 'chainIds', value: parsedIds.data })
        }}
      />
      <MultipleChoiceStep
        name="Contracts"
        isActive={store.currentStep === 5}
        hide={store.currentStep < 5}
        color={colorPallet.purple}
        multipleChoice={multipleChoiceSteps.contractStrategy}
        selectedChoice={store.contractStrategy}
        onSelect={(value) => {
          store.selectAndContinue({
            name: 'contractStrategy',
            value: value,
          })
        }}
      />
      <MultipleChoiceStep
        name="Test"
        isActive={store.currentStep === 6}
        hide={store.currentStep < 6}
        color={colorPallet.purple}
        multipleChoice={multipleChoiceSteps.testFrameworks}
        selectedChoice={store.testFrameworks}
        onSelect={(value) => {
          store.selectAndContinue({
            name: 'testFrameworks',
            value: value,
          })
        }}
      />
      <MultipleChoiceStep
        name="Linter"
        isActive={store.currentStep === 7}
        hide={store.currentStep < 7}
        color={colorPallet.purple}
        multipleChoice={multipleChoiceSteps.linters}
        selectedChoice={store.linter}
        onSelect={(value) => {
          store.selectAndContinue({
            name: 'linter',
            value: value as string,
          })
        }}
      />
      <MultipleChoiceStep
        name="Git"
        isActive={store.currentStep === 8}
        hide={store.currentStep < 8}
        color={colorPallet.purple}
        multipleChoice={multipleChoiceSteps.gitChoices}
        selectedChoice={store.noGit ? 'none' : 'git'}
        onSelect={(value) => {
          store.selectAndContinue({
            name: 'noGit',
            value: value === 'none' ? true : false,
          })
        }}
      />
      <MultipleChoiceStep
        name="Install"
        isActive={store.currentStep === 9}
        hide={store.currentStep < 9}
        color={colorPallet.purple}
        multipleChoice={multipleChoiceSteps.installChoices}
        selectedChoice={store.noInstall ? 'none' : 'install'}
        onSelect={(value) => {
          store.selectAndContinue({
            name: 'noInstall',
            value: value === 'none' ? true : false,
          })
        }}
      />
    </Box>
  )
}

