
import { Text } from 'ink'
import TextInput from 'ink-text-input'
import React from 'react'
import { type Store } from '../state/index.js'
import { Step } from '../../../components/Step.js'
import { colorPallet } from '../../../styles/colors.js'
import { nameStep } from '../constants/InputStep.js'

/**
 * Props from zustand store
 */
type StateProps = Pick<Store, 'nameInput' | 'currentStep' | 'setNameInput' | 'selectAndContinue'>

/**
 * Props from input and args
 */
type InputProps = {
  defaultName: string
}

type Props = StateProps & InputProps

/**
 * Create EVMts app step to select the name of the scaffolled project
 * Uses a TextInput and defaults to the default name if no name is entered
 */
export const NameStep: React.FC<Props> = ({ defaultName, currentStep, nameInput, setNameInput, selectAndContinue }) => {
  return (
    <Step
      name="Name"
      isActive={currentStep === 0}
      color={colorPallet.purple}
      prompt={nameStep.prompt}
      nonActiveContent={
        <Text>{nameInput}</Text>
      }
      activeContent={
        <TextInput
          onSubmit={(value) => {
            selectAndContinue({ name: 'name', value: value === '' ? defaultName : value })
          }}
          placeholder={defaultName}
          value={nameInput ?? ''}
          onChange={(nameInput) => {
            setNameInput(nameInput)
          }}
        />
      }
    />
  )
}

