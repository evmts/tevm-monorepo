import React from 'react'
import { option } from 'pastel'
import { z } from 'zod'
import CliAction from '../components/CliAction.js'
import { useAction } from '../hooks/useAction.js'

// Add command description for help output
export const description = 'Resolve an ENS name to its corresponding Ethereum address'

// Options definitions and descriptions
const optionDescriptions = {
	name: 'ENS name to resolve (env: TEVM_NAME)',
	rpc: 'RPC endpoint (env: TEVM_RPC)',
	blockTag: 'Block tag (latest, pending, etc.) (env: TEVM_BLOCK_TAG)',
	blockNumber: 'Block number to query at (env: TEVM_BLOCK_NUMBER)',
	universalResolverAddress: 'Address of ENS Universal Resolver (env: TEVM_UNIVERSAL_RESOLVER_ADDRESS)',
}

// Empty args tuple
export const args = z.tuple([])

export const options = z.object({
	// ALL PARAMETERS OPTIONAL
	name: z
		.string()
		.optional()
		.describe(
			option({
				description: optionDescriptions.name,
			}),
		),

	blockTag: z
		.string()
		.optional()
		.describe(
			option({
				description: optionDescriptions.blockTag,
			}),
		),

	blockNumber: z
		.string()
		.optional()
		.describe(
			option({
				description: optionDescriptions.blockNumber,
			}),
		),

	universalResolverAddress: z
		.string()
		.optional()
		.describe(
			option({
				description: optionDescriptions.universalResolverAddress,
			}),
		),

	// Interactive mode flag
	run: z
		.boolean()
		.default(false)
		.describe(
			option({
				description: 'Run directly without interactive parameter editing (env: TEVM_RUN)',
				alias: 'r',
			}),
		),

	// Transport options
	rpc: z
		.string()
		.optional()
		.describe(
			option({
				description: optionDescriptions.rpc,
				defaultValueDescription: 'https://eth-mainnet.g.alchemy.com/v2/demo',
			}),
		),

	// Output formatting
	formatJson: z
		.boolean()
		.optional()
		.describe(
			option({
				description: 'Format output as JSON (env: TEVM_FORMAT_JSON)',
				defaultValueDescription: 'true',
			}),
		),
})

type Props = {
	args: z.infer<typeof args>
	options: z.infer<typeof options>
}

// COMPREHENSIVE DEFAULTS
const defaultValues: Record<string, any> = {
	name: 'vitalik.eth',
	blockTag: 'latest',
	rpc: 'https://eth-mainnet.g.alchemy.com/v2/demo', // ENS is only on mainnet
}

// Helper function to safely parse block number
const parseBlockNumber = (blockNumber?: string): bigint | undefined => {
	if (!blockNumber) return undefined
	try {
		return BigInt(blockNumber)
	} catch (_e) {
		console.warn(`Could not convert "${blockNumber}" to BigInt`)
		return undefined
	}
}

export default function GetEnsAddress({ options }: Props) {
	// Use the action hook
	const actionResult = useAction({
		actionName: 'getEnsAddress',
		options,
		defaultValues,
		optionDescriptions,

		// Create params
		createParams: (enhancedOptions: Record<string, any>) => {
			const params: Record<string, any> = {
				name: enhancedOptions['name'] || defaultValues['name'],
			}

			// Add block identifier - only one should be used
			if (enhancedOptions['blockNumber']) {
				params['blockNumber'] = parseBlockNumber(enhancedOptions['blockNumber'])
			} else if (enhancedOptions['blockTag']) {
				params['blockTag'] = enhancedOptions['blockTag']
			}

			// Add universal resolver address if specified
			if (enhancedOptions['universalResolverAddress']) {
				params['universalResolverAddress'] = enhancedOptions['universalResolverAddress']
			}

			return params
		},

		// Execute the action
		executeAction: async (client: any, params: any): Promise<any> => {
			return await client.getEnsAddress(params)
		},
	})

	// If editor is active, render nothing
	if (actionResult.editorActive) {
		return null
	}

	return (
		<CliAction
			{...actionResult}
			targetName={`ENS name ${actionResult.options['name'] || 'vitalik.eth'}`}
			successMessage="ENS address resolved successfully!"
		/>
	)
}
