import { asyncStateColors, colorPallet } from '../styles/colors.js';
import { Box, Text } from 'ink';
import Spinner from 'ink-spinner';
import React from 'react';
const DEFAULT_DESIRED_WIDTH = 16;
const formatName = (name, desiredWidth = DEFAULT_DESIRED_WIDTH) => {
    const leftWidth = Math.floor((desiredWidth - name.length) / 2);
    const rightWidth = Math.ceil((desiredWidth - name.length) / 2);
    return ' '.repeat(leftWidth) + name + ' '.repeat(rightWidth);
};
export const Step = ({ hide = false, isActive, activeContent, nonActiveContent, name, color, icon, prompt, }) => {
    if (hide) {
        return React.createElement(React.Fragment, null);
    }
    return (React.createElement(Box, { minHeight: 3, flexDirection: 'column' },
        React.createElement(Box, { flexDirection: 'row', gap: 2 },
            React.createElement(Text, { bold: true, color: 'black', backgroundColor: color }, formatName(name, icon ? DEFAULT_DESIRED_WIDTH - 1 : DEFAULT_DESIRED_WIDTH)),
            React.createElement(Text, null, prompt)),
        React.createElement(Box, { paddingLeft: 18 }, isActive ? activeContent : nonActiveContent)));
};
export const AsyncStep = ({ name, state, prompt, successMessage, loadingMessage, errorMessage, }) => {
    return (React.createElement(Step, { name: name, isActive: state === 'loading', activeContent: state === 'loading' && (React.createElement(Text, { color: colorPallet.blue }, loadingMessage)), nonActiveContent: [
            state === 'error' && (React.createElement(Text, { color: colorPallet.red }, errorMessage)),
            state === 'success' && (React.createElement(Text, { color: colorPallet.green }, successMessage)),
        ], color: asyncStateColors[state], prompt: prompt, icon: state === 'loading' ? React.createElement(Spinner, { type: 'dots' }) : undefined }));
};
