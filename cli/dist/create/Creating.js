import {} from '../components/Step.js';
import Table from '../components/Table.js';
import { useCreateEvmtsApp } from '../hooks/useCreateEvmtsApp.js';
import { asyncStateColors, colorPallet } from '../styles/colors.js';
import { getTailLogs } from '../utils/getTailLogs.js';
import { Box, Text } from 'ink';
import Spinner from 'ink-spinner';
import { relative } from 'path';
import React from 'react';
const AsyncStep = ({ name, error, prompt, mutationState, progressMessage, }) => {
    const icon = {
        idle: '🔵',
        pending: '🟡',
        success: '🟢',
        error: '🔴',
    }[mutationState];
    const errorMessage = typeof error === 'string' ? error : error?.message;
    const promptColor = {
        idle: colorPallet.gray,
        pending: asyncStateColors.loading,
        success: colorPallet.white,
        error: asyncStateColors.error,
    }[mutationState];
    return (React.createElement(Box, { flexDirection: 'column' },
        React.createElement(Box, { flexDirection: 'row', gap: 2 },
            React.createElement(Text, { bold: true, color: promptColor, dimColor: mutationState !== 'pending' }, icon),
            React.createElement(Text, null, mutationState === 'pending' && React.createElement(Spinner, { type: 'dots' })),
            React.createElement(Text, null, name),
            React.createElement(Text, null, prompt)),
        React.createElement(Text, null, mutationState === 'pending' && getTailLogs(progressMessage)),
        React.createElement(Text, { color: asyncStateColors.error }, mutationState === 'error' && errorMessage)));
};
export const Creating = ({ store }) => {
    const createState = useCreateEvmtsApp(store);
    const { createFixturesMutation: m0, copyTemplateMutation: m1, gitInitMutation: m2, installDependenciesMutation: m3, } = createState;
    return (React.createElement(Box, { display: 'flex', flexDirection: 'column' },
        React.createElement(Table, { data: [
                {
                    name: store.name,
                    template: store.framework,
                    node_modules: store.packageManager,
                    path: relative(process.cwd(), store.path),
                },
            ] }),
        React.createElement(Text, null,
            "completed ",
            createState.settled,
            " of ",
            createState.length,
            " tasks"),
        React.createElement(AsyncStep, { name: 'Init', mutationState: m0.isSuccess
                ? 'success'
                : m0.isPending
                    ? 'pending'
                    : m0.isError
                        ? 'error'
                        : 'idle', prompt: `mkdir ${store.path}`, progressMessage: 'Initializing project...', error: m0.error }),
        React.createElement(AsyncStep, { name: 'Scaffolding', mutationState: m1.isSuccess
                ? 'success'
                : m1.isPending
                    ? 'pending'
                    : m1.isError
                        ? 'error'
                        : 'idle', prompt: `Initialize ${store.framework}`, progressMessage: 'Copying template...', error: m1.error }),
        React.createElement(AsyncStep, { name: 'Git', mutationState: m2.isSuccess
                ? 'success'
                : m2.isPending
                    ? 'pending'
                    : m2.isError
                        ? 'error'
                        : 'idle', prompt: 'git init', progressMessage: m2.stderr || m2.stdout, error: m2.error }),
        React.createElement(AsyncStep, { name: 'Packages', mutationState: m3.isSuccess
                ? 'success'
                : m3.isPending
                    ? 'pending'
                    : m3.isError
                        ? 'error'
                        : 'idle', prompt: `Install ${store.packageManager} dependencies`, progressMessage: m3.stderr || m3.stdout, error: m3.error })));
};
