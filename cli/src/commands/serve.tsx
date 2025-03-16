import React, { useState } from 'react';
import { Text, Box, useInput } from 'ink';
import zod from 'zod';
import { option } from 'pastel';
import { useQuery } from '@tanstack/react-query';
import Spinner from 'ink-spinner';

// Import action components
import Call from './call.js';
import GetAccount from './getAccount.js';
import SetAccount from './setAccount.js';

// Import refactored components
import ActionTab from '../components/ActionTab.js';
import LogViewer from '../components/LogViewer.js';
import HomeTab from '../components/HomeTab.js';
import { initializeServer } from '../utils/server.js';

export const options = zod.object({
	port: zod.number().default(8545).describe(
		option({
			description: 'Port to listen on',
			defaultValueDescription: '8545',
		})
	),
	host: zod.string().default('localhost').describe(
		option({
			description: 'Host to bind to',
			defaultValueDescription: 'localhost',
		})
	),
	fork: zod.string().optional().describe(
		option({
			description: 'URL of network to fork',
		})
	),
	chainId: zod.string().default('900').describe(
		option({
			description: 'Use known chain ID',
			defaultValueDescription: '900 (tevm)',
		})
	),
	forkBlockNumber: zod.string().default('latest').describe(
		option({
			description: 'Set fork block number',
			defaultValueDescription: 'latest',
		})
	),
	loggingLevel: zod.string().default('info').describe(
		option({
			description: 'Set logging level',
			defaultValueDescription: 'info',
		})
	),
	verbose: zod.boolean().default(false).describe(
		option({
			description: 'Enable verbose logging of JSON-RPC requests',
		})
	)
});

type Props = {
	options: zod.infer<typeof options>;
};

export default function Serve({ options }: Props) {
	const [activeTab, setActiveTab] = useState(0);
	const [isInteractive, setIsInteractive] = useState(false);

	// Generate the RPC URL for the local server
	const rpcUrl = `http://${options.host}:${options.port}`;

	// Define tabs with action components
	const tabs = [
		{ name: 'Home', component: null }, // Home tab - use server info display
		{
			name: 'Call',
			component: () => <ActionTab
				actionName="Call"
				interactive={isInteractive}
				rpcUrl={rpcUrl}
				ActionComponent={Call}
			/>
		},
		{
			name: 'GetAccount',
			component: () => <ActionTab
				actionName="GetAccount"
				interactive={isInteractive}
				rpcUrl={rpcUrl}
				ActionComponent={GetAccount}
			/>
		},
		{
			name: 'SetAccount',
			component: () => <ActionTab
				actionName="SetAccount"
				interactive={isInteractive}
				rpcUrl={rpcUrl}
				ActionComponent={SetAccount}
			/>
		},
		{ name: 'Logs', component: LogViewer }
	];

	// Use React Query to start and manage the server
	const { isLoading, isError, error } = useQuery({
		queryKey: ['server', options],
		queryFn: async () => {
			return initializeServer({
				port: options.port,
				host: options.host,
				chainId: options.chainId,
				fork: options.fork,
				forkBlockNumber: options.forkBlockNumber,
				loggingLevel: options.loggingLevel,
				verbose: options.verbose
			});
		},
		retry: false,
		refetchOnWindowFocus: false,
		refetchOnReconnect: false,
		enabled: true,
		staleTime: Infinity,
		gcTime: 0,
	});

	// Handle keyboard navigation and interaction
	useInput((_, key) => {
		// If in interactive mode, only handle Escape to exit
		if (isInteractive) {
			if (key.escape) {
				setIsInteractive(false);
			}
			return;
		}

		// Tab navigation when not in interactive mode
		if (key.tab || key.rightArrow) {
			setActiveTab((prev) => (prev + 1) % tabs.length);
		} else if ((key.shift && key.tab) || key.leftArrow) {
			setActiveTab((prev) => (prev - 1 + tabs.length) % tabs.length);
		} else if (key.return && activeTab > 0) {
			// Enter on a tab enters interactive mode
			setIsInteractive(true);
		}
	});

	// Display loading state while server is starting
	if (isLoading) {
		return (
			<Box>
				<Text>
					<Text color="green">
						<Spinner type="dots" />
					</Text>
					{' Starting server...'}
				</Text>
			</Box>
		);
	}

	// Display error state if server failed to start
	if (isError) {
		return (
			<Box flexDirection="column">
				<Text color="red">Error starting server: {error instanceof Error ? error.message : String(error)}</Text>
			</Box>
		);
	}

	// Render content based on active tab and interactive state
	const renderContent = () => {
		// Home tab content - server info
		if (activeTab === 0) {
			return (
				<HomeTab
					host={options.host}
					port={options.port}
					chainId={options.chainId}
					fork={options.fork}
					verbose={options.verbose}
				/>
			);
		}

		// Action component or Logs tab
		const currentTab = tabs[activeTab];
		if (currentTab && currentTab.component) {
			const TabComponent = currentTab.component;
			return <TabComponent interactive={isInteractive} />;
		}

		return <Text>Tab content not available</Text>;
	};

	return (
		<Box flexDirection="column">
			{/* Only show tabs if not in interactive mode */}
			{!isInteractive && (
				<Box marginBottom={1}>
					{tabs.map((tab, index) => (
						<Box key={tab.name} marginRight={2}>
							<Text
								backgroundColor={activeTab === index ? 'blue' : undefined}
								color={activeTab === index ? 'white' : 'gray'}
								bold={activeTab === index}
							>
								{tab.name}
							</Text>
						</Box>
					))}
				</Box>
			)}

			{/* Tab content */}
			<Box marginTop={1}>
				{renderContent()}
			</Box>

			{/* Help text */}
			<Box marginTop={1}>
				{isInteractive ? (
					<Text>Press Escape to return to tabs</Text>
				) : (
					<Text>Use Tab/Arrow keys to navigate between tabs{activeTab > 0 ? ', Enter to interact with action' : ''}</Text>
				)}
			</Box>
		</Box>
	);
}
