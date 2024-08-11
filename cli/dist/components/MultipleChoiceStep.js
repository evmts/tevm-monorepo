import { SelectInput } from './SelectInput.js';
import { Step } from './Step.js';
import { Text } from 'ink';
import React from 'react';
export const MultipleChoiceStep = ({ multipleChoice, selectedChoice, onSelect, ...stepProps }) => {
    return (React.createElement(Step, { ...stepProps, prompt: multipleChoice.prompt, nonActiveContent: React.createElement(Text, null, multipleChoice.choices[selectedChoice]?.label), activeContent: React.createElement(SelectInput, { items: Object.values(multipleChoice.choices), onSelect: (choice) => {
                onSelect(choice.value);
            } }) }));
};
