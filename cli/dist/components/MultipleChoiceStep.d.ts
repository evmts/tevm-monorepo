import type { MultipleChoiceStep as MultipleChoiceStepType } from '../constants/index.js';
import { type StepProps } from './Step.js';
import React from 'react';
type Props<T extends MultipleChoiceStepType> = Pick<StepProps, 'isActive' | 'hide' | 'color' | 'name'> & {
    multipleChoice: T;
    selectedChoice: keyof T['choices'];
    onSelect: (value: keyof T['choices']) => void;
};
export declare const MultipleChoiceStep: <T extends MultipleChoiceStepType>({ multipleChoice, selectedChoice, onSelect, ...stepProps }: Props<T>) => React.JSX.Element;
export {};
//# sourceMappingURL=MultipleChoiceStep.d.ts.map