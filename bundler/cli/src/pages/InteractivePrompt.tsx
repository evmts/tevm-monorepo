import React, { type ReactNode } from 'react'
import { chainIdsValidator } from '../options.js'
import { type Store } from '../state/Store.js'
import * as inputSteps from '../constants/InputStep.js'
import { colorPallet } from '../styles/colors.js'
import * as multipleChoiceSteps from '../constants/MultipleChoice.js'
import { frameworksByUseCase } from '../constants/frameworksByUseCase.js'
import { MultipleChoiceStep } from '../components/MultipleChoiceStep.js'
import { TextInputStep } from '../components/TextInputStep.js'

const defaultChainIds = '1,10'
const defaultWalletConnect = '898f836c53a18d0661340823973f0cb4'

type Props = {
  defaultName: string
  store: Store
}

export const InteractivePrompt: React.FC<Props> = ({ defaultName, store }) => {
  const steps: Array<ReactNode> = []

  steps.push(
    <TextInputStep
      name="Name"
      isActive={store.currentStep === steps.length}
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
  )

  steps.push(
    <MultipleChoiceStep
      name="Use case"
      isActive={store.currentStep === steps.length}
      hide={store.currentStep < steps.length}
      color={colorPallet.purple}
      multipleChoice={multipleChoiceSteps.useCases}
      selectedChoice={store.useCase}
      onSelect={(value) => {
        store.selectAndContinue({
          name: 'useCase',
          value: value,
        })
      }}
    />)

  steps.push(
    <MultipleChoiceStep
      name="Template"
      isActive={store.currentStep === steps.length}
      hide={store.currentStep < steps.length}
      color={colorPallet.purple}
      multipleChoice={frameworksByUseCase[store.useCase] as typeof multipleChoiceSteps.frameworks}
      selectedChoice={store.framework}
      onSelect={(value) => {
        store.selectAndContinue({
          name: 'framework',
          value,
        })
      }}
    />)

  const isBun = store.framework.includes('bun')
  const isMud = store.framework.includes('mud')
  const isUi = Object.keys(frameworksByUseCase.ui.choices).includes(store.framework)
  if (!isBun && !isMud) {
    steps.push(
      <MultipleChoiceStep
        name="Manager"
        isActive={store.currentStep === steps.length}
        hide={store.currentStep < steps.length}
        color={colorPallet.purple}
        multipleChoice={multipleChoiceSteps.packageManagers}
        selectedChoice={store.packageManager}
        onSelect={(value) => {
          store.selectAndContinue({
            name: 'packageManager',
            value: value,
          })
        }}
      />)
  }

  if (!isMud) {
    steps.push(
      <MultipleChoiceStep
        name="Solidity"
        isActive={store.currentStep === steps.length}
        hide={store.currentStep < steps.length}
        color={colorPallet.purple}
        multipleChoice={multipleChoiceSteps.solidityFrameworks}
        selectedChoice={store.solidityFramework}
        onSelect={(value) => {
          store.selectAndContinue({
            name: 'solidityFramework',
            value: value,
          })
        }}
      />)
  }

  steps.push(
    <TextInputStep
      name="ChainIds"
      isActive={store.currentStep === steps.length}
      hide={store.currentStep < steps.length}
      color={colorPallet.purple}
      step={inputSteps.chainIds}
      value={store.chainIdInput}
      placeholder={defaultChainIds}
      onChange={(value) => {
        const { success } = chainIdsValidator.safeParse(value.endsWith(',') ? value.slice(0, value.length - 1) : value)
        if (!success) {
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
    />)

  if (isUi) {
    steps.push(
      <TextInputStep
        name="WalletConnect"
        isActive={store.currentStep === steps.length}
        hide={store.currentStep < steps.length}
        color={colorPallet.purple}
        step={inputSteps.walletConnectProjectId}
        value={store.chainIdInput}
        placeholder={defaultWalletConnect}
        onChange={(value) => {
          store.setInput({ input: 'walletConnectIdInput', value })
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
      />)
  }

  if (!isMud) {
    steps.push(
      <MultipleChoiceStep
        name="Contracts"
        isActive={store.currentStep === steps.length}
        hide={store.currentStep < steps.length}
        color={colorPallet.purple}
        multipleChoice={multipleChoiceSteps.contractStrategy}
        selectedChoice={store.contractStrategy}
        onSelect={(value) => {
          store.selectAndContinue({
            name: 'contractStrategy',
            value: value,
          })
        }}
      />)
  }

  if (!isMud) {
    steps.push(
      <MultipleChoiceStep
        name="TypeScript"
        isActive={store.currentStep === steps.length}
        hide={store.currentStep < steps.length}
        color={colorPallet.purple}
        multipleChoice={multipleChoiceSteps.gitChoices}
        selectedChoice={store.noGit ? 'none' : 'git'}
        onSelect={(value) => {
          store.selectAndContinue({
            name: 'noGit',
            value: value === 'none' ? true : false,
          })
        }}
      />)
  }

  if (!isMud) {
    steps.push(
      <TextInputStep
        name="WalletConnect"
        isActive={store.currentStep === steps.length}
        hide={store.currentStep < steps.length}
        color={colorPallet.purple}
        step={inputSteps.nameStep}
        value={store.nameInput}
        placeholder={defaultName}
        onChange={(value) => {
          store.setInput({ input: 'walletConnectIdInput', value })
        }}
        onSubmit={(value) => {
          if (value === '') {
            store.selectAndContinue({ name: 'name', value: defaultName })
            return
          }
          store.selectAndContinue({ name: 'name', value })
        }}
      />)
  }

  if (!isMud && !isBun) {
    steps.push(
      <MultipleChoiceStep
        name="Test"
        isActive={store.currentStep === steps.length}
        hide={store.currentStep < steps.length}
        color={colorPallet.purple}
        multipleChoice={multipleChoiceSteps.testFrameworks}
        selectedChoice={store.testFrameworks}
        onSelect={(value) => {
          store.selectAndContinue({
            name: 'testFrameworks',
            value: value,
          })
        }}
      />)
  }

  if (!isMud) {
    steps.push(
      <MultipleChoiceStep
        name="Linter"
        isActive={store.currentStep === steps.length}
        hide={store.currentStep < steps.length}
        color={colorPallet.purple}
        multipleChoice={multipleChoiceSteps.linters}
        selectedChoice={store.linter}
        onSelect={(value) => {
          store.selectAndContinue({
            name: 'linter',
            value: value as string,
          })
        }}
      />)
  }

  steps.push(
    <MultipleChoiceStep
      name="Ci"
      isActive={store.currentStep === steps.length}
      hide={store.currentStep < steps.length}
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
  )


  steps.push(
    <MultipleChoiceStep
      name="Git"
      isActive={store.currentStep === steps.length}
      hide={store.currentStep < steps.length}
      color={colorPallet.purple}
      multipleChoice={multipleChoiceSteps.gitChoices}
      selectedChoice={store.noGit ? 'none' : 'git'}
      onSelect={(value) => {
        store.selectAndContinue({
          name: 'noGit',
          value: value === 'none' ? true : false,
        })
      }}
    />)

  steps.push(
    <MultipleChoiceStep
      name="Install"
      isActive={store.currentStep === steps.length}
      hide={store.currentStep < steps.length}
      color={colorPallet.purple}
      multipleChoice={multipleChoiceSteps.installChoices}
      selectedChoice={store.noInstall ? 'none' : 'install'}
      onSelect={(value) => {
        store.selectAndContinue({
          name: 'noInstall',
          value: value === 'none' ? true : false,
        })
      }}
    />)

  return (
    <>
      {...steps}
    </>
  )
}

