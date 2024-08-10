import { Creating } from './Creating.js';
import { InteractivePrompt } from './InteractivePrompt.js';
import { FancyCreateTitle } from '../components/FancyCreateTitle.js';
import {} from './options.js';
import { useStore } from '../state/Store.js';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Box, Text } from 'ink';
import React, {} from 'react';
import { z } from 'zod';
const queryClient = new QueryClient();
export const App = ({ options, args: [defaultName] }) => {
    const store = useStore({
        ...options,
        name: defaultName,
        currentStep: 0,
        path: '.',
        nameInput: '',
        walletConnectIdInput: '',
        currentPage: options.skipPrompts ? 'creating' : 'interactive',
    });
    const pages = {
        interactive: React.createElement(InteractivePrompt, { defaultName: defaultName, store: store }),
        complete: React.createElement(Text, null, "Complete"),
        creating: React.createElement(Creating, { store: store }),
    };
    return (React.createElement(QueryClientProvider, { client: queryClient },
        React.createElement(Box, { display: 'flex', flexDirection: 'column' },
            React.createElement(FancyCreateTitle, { key: store.currentPage, loading: store.currentPage === 'creating' }),
            pages[store.currentPage])));
};
