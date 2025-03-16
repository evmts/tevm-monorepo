import { Text } from 'ink'
import React from 'react'
import TextInput from 'ink-text-input'
import { Step } from './Step.js'

type InputStep = {
  type: 'input'
  prompt: string
  stateKey: string
}

type Props = {
  name: string
  isActive?: boolean
  hide?: boolean
  color: string
  step: InputStep
  value: string
  placeholder: string
  onChange: (value: string) => void
  onSubmit: (value: string) => void
}

export const TextInputStep: React.FC<Props> = ({
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