import type { InputStep } from '../constants/index.js';
import { type StepProps } from './Step.js';
import type { FC } from 'react';
type Props = Pick<StepProps, 'isActive' | 'hide' | 'color' | 'name'> & {
    step: InputStep;
    value: string;
    placeholder: string;
    onSubmit: (value: string) => void;
    onChange: (value: string) => void;
};
export declare const TextInputStep: FC<Props>;
export {};
//# sourceMappingURL=TextInputStep.d.ts.map