import React from 'react'
import { Box, Text } from 'ink'

// Add command description for help output
export const description = 'Execute various Ethereum actions and transactions'

export default function Action() {
	return (
		<Box flexDirection="column" padding={1}>
			<Text bold>TEVM Action Commands</Text>
			<Text>Run `tevm action --help` to see available action subcommands.</Text>
			<Box marginY={1}>
				<Text>Available actions include: simulateCalls, sendRawTransaction, createAccessList, getBalance</Text>
			</Box>
		</Box>
	)
}
