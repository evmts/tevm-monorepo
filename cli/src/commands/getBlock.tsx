import { option } from 'pastel'
import { z } from 'zod'
import CliAction from '../components/CliAction.js'
import { useAction } from '../hooks/useAction.js'

// Add command description for help output
export const description = 'Get information about a specific block from the blockchain'

// Options definitions and descriptions
const optionDescriptions = {
	blockHash: 'Block hash to get information for (env: TEVM_BLOCK_HASH)',
	blockNumber: 'Block number to get information for (env: TEVM_BLOCK_NUMBER)',
	blockTag: 'Block tag (latest, pending, etc.) (env: TEVM_BLOCK_TAG)',
	includeTransactions: 'Whether to include full transaction objects (env: TEVM_INCLUDE_TRANSACTIONS)',
	rpc: 'RPC endpoint (env: TEVM_RPC)',
}

// Empty args tuple
export const args = z.tuple([])

export const options = z.object({
	// ALL PARAMETERS OPTIONAL
	blockHash: z
		.string()
		.optional()
		.describe(
			option({
				description: optionDescriptions.blockHash,
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

	includeTransactions: z
		.boolean()
		.optional()
		.describe(
			option({
				description: optionDescriptions.includeTransactions,
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
	blockTag: 'latest',
	includeTransactions: false,
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

export default function GetBlock({ options }: Props) {
	// Use the action hook
	const actionResult = useAction({
		actionName: 'getBlock',
		options,
		defaultValues,
		optionDescriptions,

		// Create params
		createParams: (enhancedOptions: Record<string, any>) => {
			const params: Record<string, any> = {}

			// Add block identifier - only one should be used
			if (enhancedOptions['blockHash']) {
				params['blockHash'] = enhancedOptions['blockHash']
			} else if (enhancedOptions['blockNumber']) {
				params['blockNumber'] = parseBlockNumber(enhancedOptions['blockNumber'])
			} else if (enhancedOptions['blockTag']) {
				params['blockTag'] = enhancedOptions['blockTag']
			}

			// Include full transaction objects if specified
			if (enhancedOptions['includeTransactions'] !== undefined) {
				params['includeTransactions'] = enhancedOptions['includeTransactions']
			}

			return params
		},

		// Execute the action
		executeAction: async (client: any, params: any): Promise<any> => {
			return await client.getBlock(params)
		},
	})

	// If editor is active, render nothing
	if (actionResult.editorActive) {
		return null
	}

	// Render the action UI with appropriate targeting
	let targetDesc = 'latest block'
	if (actionResult.options['blockHash']) {
		targetDesc = `block ${actionResult.options['blockHash'].substring(0, 10)}...`
	} else if (actionResult.options['blockNumber']) {
		targetDesc = `block #${actionResult.options['blockNumber']}`
	} else if (actionResult.options['blockTag'] && actionResult.options['blockTag'] !== 'latest') {
		targetDesc = `${actionResult.options['blockTag']} block`
	}

	return (
		<CliAction {...actionResult} targetName={targetDesc} successMessage="Block information retrieved successfully!" />
	)
}
