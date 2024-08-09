import React, { useMemo } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Box } from 'ink';
import { StartServer } from './StartServer.js';
import { z } from 'zod';
import { options as optionsSchema } from './options.js';
const queryClient = new QueryClient();
export const Server = ({ options }) => {
    const parsedOptions = useMemo(() => {
        return optionsSchema.safeParse(options);
    }, [options]);
    if (parsedOptions.success === false) {
        return (React.createElement(Box, { display: "flex", flexDirection: "column", padding: 1 },
            "Invalid options $",
            parsedOptions.error.message));
    }
    return (React.createElement(QueryClientProvider, { client: queryClient },
        React.createElement(Box, { display: "flex", flexDirection: "column", padding: 1 },
            React.createElement(StartServer, { options: parsedOptions.data }))));
};
