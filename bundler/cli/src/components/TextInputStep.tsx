import type { FC } from "react"
import React from 'react'
import type { InputStep } from "../pages/create/constants/InputStep.js"
import { Step, type StepProps } from "./Step.js"
import { Text } from "ink"
import TextInput from "ink-text-input"

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
      nonActiveContent={
        <Text>{value}</Text>
      }
      activeContent={
        <TextInput
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onSubmit={onSubmit}
        />
      }
    />)
}
