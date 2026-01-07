#!/usr/bin/env node

import { base, mainnet, optimism, tevmDefault } from '@tevm/common'
import { nativeHttp } from '@tevm/jsonrpc'
import { createTevmTransport } from '@tevm/memory-client'
import { PREFUNDED_ACCOUNTS, PREFUNDED_PRIVATE_KEYS } from '@tevm/utils'
import { Command } from 'commander'
import { createServer } from '../src/createServer.js'

const program = new Command('tevm-server')

program
	.option('--fork-url <url>', 'set fork URL')
	.option('--chain-id <id>', 'use known chain id', '900')
	.option('--fork-block-number <number>', 'set fork block number', 'latest')
	.option('--host <host>', 'set host', 'localhost')
	.option('--port <port>', 'set port', '8545')
	.option('--logging-level <level>', 'set logging level', 'info')
	.addHelpText(
		'after',
		`
Examples:
  $ node script.js --chain-id 1 --fork-url http://example.com --logging-level debug
  $ node script.js --host 0.0.0.0 --port 8080
  `,
	)

program.parse(process.argv)

const options = program.opts()

const chains = {
	[base.id]: base,
	[optimism.id]: optimism,
	[mainnet.id]: mainnet,
	[tevmDefault.id]: tevmDefault,
}

const chain = chains[options.chainId]

if (!chain) {
	throw new Error(
		`Unknown chain id: ${options.chainId}. Valid chain ids are ${Object.values(chains)
			.map((chain) => chain.id)
			.join(', ')}`,
	)
}

export const transport = createTevmTransport({
	common: chain,
	fork: {
		blockTag: options.forkBlockNumber,
		transport: nativeHttp(options.forkUrl ?? chain.rpcUrls.default.http[0])({}),
	},
	loggingLevel: options.loggingLevel,
})

const server = createServer(transport)

// Display ASCII art and information
function displayStartupInfo() {
	console.log(` ___                 
|_ _|___  _ _ ._ _ _ 
 | |/ ._>| | || ' ' |
 |_|___.|__/ |_|_|_|
                     
https://tevm.sh

Available Accounts
==================
${PREFUNDED_ACCOUNTS.map((acc, index) => `(${index}) ${acc.address} (1000 ETH)`).join('\n')}

Private Keys
==================
${PREFUNDED_PRIVATE_KEYS.map((acc, index) => `(${index}) ${acc}`).join('\n')}

Wallet
==================
Mnemonic:          test test test test test test test test test test test junk
Derivation path:   m/44'/60'/0'/0/

Chain ID
==================
${options.chainId}

Listening on ${options.host}:${options.port}
`)
}

server.listen(Number.parseInt(options.port, 10), options.host, () => {
	displayStartupInfo()
})
