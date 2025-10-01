import { Box, Text } from 'ink'

type ActionTabProps = {
	actionName: string
	interactive: boolean
	rpcUrl: string
	ActionComponent: React.ComponentType<any>
}

const ActionTab: React.FC<ActionTabProps> = ({ actionName, interactive, rpcUrl, ActionComponent }) => {
	if (!interactive) {
		return (
			<Box flexDirection="column">
				<Text bold>{actionName} Action</Text>
				<Text>Press Enter to use this action interactively</Text>
			</Box>
		)
	}

	// Only render the actual action component when in interactive mode
	return (
		<ActionComponent
			options={{
				interactive: true,
				rpc: rpcUrl,
				formatJson: true,
			}}
			args={[]}
		/>
	)
}

export default ActionTab
