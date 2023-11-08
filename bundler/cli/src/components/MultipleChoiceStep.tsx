import React from "react";
import { Step, type StepProps } from "./Step.js";
import type { MultipleChoiceStep as MultipleChoiceStepType } from "../pages/create/constants/MultipleChoice.js";
import { Text } from "ink";
import { SelectInput } from "./SelectInput.js";

type Props<T extends MultipleChoiceStepType> = Pick<StepProps, 'isActive' | 'hide' | 'color' | 'name'> & {
  multipleChoice: T
  selectedChoice: keyof T['choices']
  onSelect: (value: keyof T['choices']) => void
}

export const MultipleChoiceStep = <T extends MultipleChoiceStepType>({
  multipleChoice,
  selectedChoice,
  onSelect,
  ...stepProps
}: Props<T>) => {
  return (
    <Step
      {...stepProps}
      prompt={multipleChoice.prompt}
      nonActiveContent={
        <Text>{multipleChoice.choices[selectedChoice as keyof typeof multipleChoice.choices]?.label}</Text>
      }
      activeContent={
        <SelectInput
          items={Object.values(multipleChoice.choices)}
          onSelect={onSelect as any}
        />
      }
    />
  )
}
