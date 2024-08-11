import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Box, Text } from 'ink';
import { PREFUNDED_ACCOUNTS, PREFUNDED_PRIVATE_KEYS } from '@tevm/utils';
import { startTevm } from './startTevm.js';
import { FancyCreateTitle } from '../components/FancyCreateTitle.js';
export const StartServer = ({ options }) => {
    const { data, error, isLoading } = useQuery({
        queryKey: ['tevm', options.preset, options.preset, options.host, options.loggingLevel, options.block, options.forkUrl, options.port],
        queryFn: () => startTevm(options),
        staleTime: Infinity,
    });
    return (React.createElement(Box, null,
        React.createElement(FancyCreateTitle, { loading: isLoading }),
        (() => {
            if (isLoading) {
                return React.createElement(Text, null, "Initializing...");
            }
            if (error) {
                return (React.createElement(Box, null,
                    React.createElement(Text, { color: "red" },
                        "Error starting TEVM server: ",
                        error.message)));
            }
        })()));
    return (React.createElement(Box, { flexDirection: "column" },
        React.createElement(Text, null, "TEVM server started successfully!"),
        React.createElement(Box, { flexDirection: "column", marginY: 1 },
            React.createElement(Text, null,
                "Chain ID: ",
                options.chainId),
            React.createElement(Text, null,
                "Listening on ",
                options.host,
                ":",
                options.port),
            React.createElement(Text, null,
                "Logging Level: ",
                options.loggingLevel)),
        React.createElement(Text, null, "Available Accounts"),
        React.createElement(Text, null, PREFUNDED_ACCOUNTS.map((acc, index) => `(${index}) ${acc.address} (1000 ETH)`).join('\n')),
        React.createElement(Text, null, "Private Keys"),
        React.createElement(Text, null, PREFUNDED_PRIVATE_KEYS.map((acc, index) => `(${index}) ${acc}`).join('\n')),
        React.createElement(Text, null, "Wallet"),
        React.createElement(Text, null, "Mnemonic: test test test test test test test test test test test junk"),
        React.createElement(Text, null, "Derivation path: m/44'/60'/0'/0/")));
};
