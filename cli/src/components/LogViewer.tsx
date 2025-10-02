import { Box, Text, useInput } from 'ink'

import { useLogStore } from '../stores/logStore.js'

type LogViewerProps = {
	interactive?: boolean
}

const LogViewer: React.FC<LogViewerProps> = ({ interactive = false }) => {
	const { logs, clearLogs } = useLogStore()

	// Handle keyboard input when in interactive mode
	useInput((input) => {
		if (interactive && input === 'c') {
			clearLogs()
		}
	})

	return (
		<Box flexDirection="column" padding={1}>
			<Box justifyContent="space-between" marginBottom={1}>
				<Text bold>JSON-RPC Logs</Text>
				{interactive && <Text>Press 'c' to clear logs</Text>}
			</Box>

			{logs.length === 0 ? (
				<Text>No logs yet...</Text>
			) : (
				<Box flexDirection="column">
					{logs.map((log) => (
						<Box key={log.id} flexDirection="column" marginBottom={1}>
							<Box>
								<Text color="gray">[{log.timestamp}] </Text>
								<Text color={log.type === 'request' ? 'blue' : log.type === 'response' ? 'green' : 'red'}>
									{log.type === 'request' ? '→ Request' : log.type === 'response' ? '← Response' : '✖ Error'}
								</Text>
							</Box>
							<Box paddingLeft={2}>
								<Text wrap="wrap">{log.content}</Text>
							</Box>
						</Box>
					))}
				</Box>
			)}
		</Box>
	)
}

export default LogViewer
