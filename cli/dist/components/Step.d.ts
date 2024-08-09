import { colorPallet } from '../styles/colors.js';
import React from 'react';
import type { FC, ReactNode } from 'react';
type ValueOf<T> = T[keyof T];
export type StepProps = {
    isActive?: boolean;
    activeContent: React.ReactNode;
    nonActiveContent: React.ReactNode;
    name: string;
    prompt: string;
    color: ValueOf<typeof colorPallet>;
    icon?: ReactNode;
    children?: never;
    hide?: boolean;
};
export declare const Step: FC<StepProps>;
export type AsyncStepState = 'loading' | 'error' | 'success';
export type AsyncStepProps = {
    name: string;
    state: AsyncStepState;
    prompt: string;
    successMessage: string;
    errorMessage: string;
    loadingMessage: string;
};
export declare const AsyncStep: FC<AsyncStepProps>;
export {};
//# sourceMappingURL=Step.d.ts.map