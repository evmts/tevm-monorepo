import React from 'react'
import { option } from 'pastel'
import { z } from 'zod'
import CliAction from '../../components/CliAction.js'
import { useAction } from '../../hooks/useAction.js'

// Add command description for help output
export const description = 'Get the Ether balance of an Ethereum address'

// Options definitions and descriptions
const optionDescriptions = {
	address: 'Account address to get balance for (env: TEVM_ADDRESS)',
	blockNumber: 'Block number to query at (env: TEVM_BLOCK_NUMBER)',
	blockTag: 'Block tag (latest, pending, etc.) (env: TEVM_BLOCK_TAG)',
	rpc: 'RPC endpoint (env: TEVM_RPC)',
}

// Empty args tuple
export const args = z.tuple([])

export const options = z.object({
	// ALL PARAMETERS OPTIONAL
	address: z
		.string()
		.optional()
		.describe(
			option({
				description: optionDescriptions.address,
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

	blockTag: z
		.string()
		.optional()
		.describe(
			option({
				description: optionDescriptions.blockTag,
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
				defaultValueDescription: 'http://localhost:8545',
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
	address: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
	blockTag: 'latest',
	rpc: 'http://localhost:8545',
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

export default function GetBalance({ options }: Props) {
	// Use the action hook
	const actionResult = useAction({
		actionName: 'getBalance',
		options,
		defaultValues,
		optionDescriptions,

		// Create params
		createParams: (enhancedOptions: Record<string, any>) => {
			const params: Record<string, any> = {
				address: enhancedOptions['address'] || defaultValues['address'],
			}

			// Add block identifier - only one should be used
			if (enhancedOptions['blockNumber']) {
				params['blockNumber'] = parseBlockNumber(enhancedOptions['blockNumber'])
			} else if (enhancedOptions['blockTag']) {
				params['blockTag'] = enhancedOptions['blockTag']
			}

			return params
		},

		// Execute the action
		executeAction: async (client: any, params: any): Promise<any> => {
			return await client.getBalance(params)
		},
	})

	// If editor is active, render nothing
	if (actionResult.editorActive) {
		return null
	}

	const shortAddress = actionResult.options['address']
		? `${actionResult.options['address'].substring(0, 6)}...${actionResult.options['address'].substring(38)}`
		: '0xA0Cf...251e'

	return (
		<CliAction
			{...actionResult}
			targetName={`address ${shortAddress}`}
			successMessage="Balance retrieved successfully!"
		/>
	)
}
