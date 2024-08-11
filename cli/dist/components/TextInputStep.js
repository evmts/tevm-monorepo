import { Step } from './Step.js';
import { Text } from 'ink';
import TextInput from 'ink-text-input';
import React from 'react';
export const TextInputStep = ({ step, value, placeholder, onSubmit, onChange, ...stepProps }) => {
    return (React.createElement(Step, { ...stepProps, prompt: step.prompt, nonActiveContent: React.createElement(Text, null, value === '' ? placeholder : value), activeContent: React.createElement(TextInput, { placeholder: placeholder, value: value, onChange: onChange, onSubmit: onSubmit }) }));
};
