import { FancyCreateTitle } from '../components/FancyCreateTitle.js'
import type { StartServerProps } from './StartServerProps.js'
import { startTevm } from './startTevm.js'
import { useQuery } from '@tanstack/react-query'
import { PREFUNDED_ACCOUNTS, PREFUNDED_PRIVATE_KEYS } from '@tevm/utils'
import { Box, Text } from 'ink'
import React from 'react'

export const StartServer: React.FC<StartServerProps> = ({ options }) => {
	const { data, error, isLoading } = useQuery({
		queryKey: [
			'tevm',
			options.preset,
			options.preset,
			options.host,
			options.loggingLevel,
			options.block,
			options.forkUrl,
			options.port,
		],
		queryFn: () => startTevm(options),
		staleTime: Number.POSITIVE_INFINITY,
	})

	const { data: chainId } = useQuery({
		queryKey: ['tevm', 'chainId'],
		queryFn: async () => {
			if (!data) {
				throw new Error('Chain ID not available yet')
			}
			return data.transport.tevm.getVm().then((vm) => vm.common.id)
		},
		staleTime: Number.POSITIVE_INFINITY,
		enabled: !isLoading && !error && Boolean(data),
	})

	const { data: genesisBlock } = useQuery({
		// only run once
		queryKey: ['tevm', 'block'],
		queryFn: async () => {
			if (!data) {
				throw new Error('BLock not available')
			}
			return data.transport.tevm.getVm().then((vm) => {
				return vm.blockchain.getCanonicalHeadBlock()
			})
		},
		staleTime: Number.POSITIVE_INFINITY,
		enabled: !isLoading && !error && Boolean(data),
	})

	return (
		<Box>
			<FancyCreateTitle loading={isLoading} />
			{(() => {
				if (isLoading) {
					return <Text>Initializing...</Text>
				}
				if (error) {
					return (
						<Box>
							<Text color='red'>
								Error starting TEVM server: {(error as Error).message}
							</Text>
						</Box>
					)
				}
				return (
					<Box flexDirection='column'>
						<Text>TEVM server started successfully!</Text>
						<Box flexDirection='column' marginY={1}>
							{chainId !== undefined ? <Text>Chain ID: {chainId}</Text> : <></>}
							{genesisBlock !== undefined ? (
								<Text>Base Fee: {genesisBlock.header.baseFeePerGas}</Text>
							) : (
								<></>
							)}
							{genesisBlock !== undefined ? (
								<Text>Gas Limit: {genesisBlock.header.gasLimit}</Text>
							) : (
								<></>
							)}
							{genesisBlock !== undefined ? (
								<Text>Genesis Timestamp: {genesisBlock.header.timestamp}</Text>
							) : (
								<></>
							)}
							<Text>
								Listening on {options.host}:{options.port}
							</Text>
							<Text>Logging Level: {options.loggingLevel}</Text>
						</Box>
						<Text>Available Accounts</Text>
						<Text>
							{PREFUNDED_ACCOUNTS.map(
								(acc, index) => `(${index}) ${acc.address} (1000 ETH)`,
							).join('\n')}
						</Text>
						<Text>Private Keys</Text>
						<Text>
							{PREFUNDED_PRIVATE_KEYS.map(
								(acc, index) => `(${index}) ${acc}`,
							).join('\n')}
						</Text>
						<Text>Wallet</Text>
						<Text>
							Mnemonic: test test test test test test test test test test test
							junk
						</Text>
						<Text>Derivation path: m/44'/60'/0'/0/</Text>
					</Box>
				)
			})()}
		</Box>
	)
}
