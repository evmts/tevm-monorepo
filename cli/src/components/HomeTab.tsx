import { PREFUNDED_ACCOUNTS, PREFUNDED_PRIVATE_KEYS } from '@tevm/utils'
import { Box, Text } from 'ink'

type HomeTabProps = {
	host: string
	port: number
	chainId: string
	fork?: string
	verbose: boolean
}

const HomeTab: React.FC<HomeTabProps> = ({ host, port, chainId, fork, verbose }) => {
	return (
		<Box flexDirection="column">
			<Text>
				{' ___                 '}
				{'\n'}
				{'|_ _|___  _ _ ._ _ _ '}
				{'\n'}
				{" | |/ ._>| | || ' ' |"}
				{'\n'}
				{' |_|\\___.|__/ |_|_|_|'}
				{'\n'}
				{'                     '}
				{'\n'}
				{'https://tevm.sh'}
				{'\n'}
				{'\n'}
				{'Available Accounts'}
				{'\n'}
				{'=================='}
			</Text>
			{PREFUNDED_ACCOUNTS.map((acc: any, index: number) => (
				<Text key={index}>
					({index}) {acc.address} (1000 ETH)
				</Text>
			))}
			<Text>
				{'\n'}
				{'Private Keys'}
				{'\n'}
				{'=================='}
			</Text>
			{PREFUNDED_PRIVATE_KEYS.map((key: string, index: number) => (
				<Text key={index}>
					({index}) {key}
				</Text>
			))}
			<Text>
				{'\n'}
				{'Wallet'}
				{'\n'}
				{'=================='}
				{'\n'}
				{'Mnemonic:          test test test test test test test test test test test junk'}
				{'\n'}
				{"Derivation path:   m/44'/60'/0'/0/"}
				{'\n'}
				{'\n'}
				{'Chain ID'}
				{'\n'}
				{'=================='}
				{'\n'}
				{chainId}
				{'\n'}
				{'\n'}
				{'Listening on '}
				{host}
				{':'}
				{port}
				{fork ? ` (forking ${fork})` : ''}
				{verbose ? '\n\nVerbose mode: ON - Check Logs tab for JSON-RPC requests' : ''}
			</Text>
		</Box>
	)
}

export default HomeTab
