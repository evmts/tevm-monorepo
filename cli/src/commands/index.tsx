import { Text, Box } from 'ink'

// Add command description for help output
export const description = "TEVM Command-Line Interface - Ethereum development, testing and deployment tools";

export default function Index() {
  return (
    <Box flexDirection="column" padding={1}>
      <Text bold>TEVM CLI</Text>
      <Text>Run `tevm --help` to see available commands.</Text>
      <Box marginY={1}>
        <Text>Visit https://tevm.sh/ for documentation.</Text>
      </Box>
    </Box>
  )
}