import { option } from 'pastel'
import { z } from 'zod'
import CliAction from '../../components/CliAction.js'
import { useAction } from '../../hooks/useAction.js'

// Add command description for help output
export const description = 'Create an EIP-2930 access list for a transaction to optimize gas usage'

// Options definitions and descriptions
const optionDescriptions = {
	account: 'Account (address) to create an access list for (env: TEVM_ACCOUNT)',
	blockNumber: 'Block number to create an access list for (env: TEVM_BLOCK_NUMBER)',
	blockTag: 'Block tag to create an access list for (env: TEVM_BLOCK_TAG)',
	data: 'Contract function selector with encoded arguments (env: TEVM_DATA)',
	gasPrice: 'Price (in wei) to pay per gas (for Legacy Transactions) (env: TEVM_GAS_PRICE)',
	maxFeePerGas: 'Max fee per gas in wei (for EIP-1559 Transactions) (env: TEVM_MAX_FEE_PER_GAS)',
	maxPriorityFeePerGas:
		'Max priority fee per gas in wei (for EIP-1559 Transactions) (env: TEVM_MAX_PRIORITY_FEE_PER_GAS)',
	to: 'Transaction recipient address (env: TEVM_TO)',
	value: 'Value (in wei) sent with this transaction (env: TEVM_VALUE)',
	rpc: 'RPC endpoint (env: TEVM_RPC)',
}

// Empty args tuple
export const args = z.tuple([])

export const options = z.object({
	// ALL PARAMETERS OPTIONAL
	account: z
		.string()
		.optional()
		.describe(
			option({
				description: optionDescriptions.account,
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

	data: z
		.string()
		.optional()
		.describe(
			option({
				description: optionDescriptions.data,
			}),
		),

	gasPrice: z
		.string()
		.optional()
		.describe(
			option({
				description: optionDescriptions.gasPrice,
			}),
		),

	maxFeePerGas: z
		.string()
		.optional()
		.describe(
			option({
				description: optionDescriptions.maxFeePerGas,
			}),
		),

	maxPriorityFeePerGas: z
		.string()
		.optional()
		.describe(
			option({
				description: optionDescriptions.maxPriorityFeePerGas,
			}),
		),

	to: z
		.string()
		.optional()
		.describe(
			option({
				description: optionDescriptions.to,
			}),
		),

	value: z
		.string()
		.optional()
		.describe(
			option({
				description: optionDescriptions.value,
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
	account: '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
	blockTag: 'latest',
	data: '0xdeadbeef',
	to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
	rpc: 'http://localhost:8545',
}

// Helper functions to parse values
const parseBigInt = (value?: string): bigint | undefined => {
	if (!value) return undefined
	try {
		return BigInt(value)
	} catch (_e) {
		console.warn(`Could not convert "${value}" to BigInt`)
		return undefined
	}
}

export default function CreateAccessList({ options }: Props) {
	// Use the action hook
	const actionResult = useAction({
		actionName: 'createAccessList',
		options,
		defaultValues,
		optionDescriptions,

		// Create params
		createParams: (enhancedOptions: Record<string, any>) => {
			const params: Record<string, any> = {}

			// Account
			if (enhancedOptions['account']) {
				params['account'] = enhancedOptions['account']
			}

			// Block identifier - only one should be used
			if (enhancedOptions['blockNumber']) {
				params['blockNumber'] = parseBigInt(enhancedOptions['blockNumber'])
			} else if (enhancedOptions['blockTag']) {
				params['blockTag'] = enhancedOptions['blockTag']
			}

			// Transaction data
			if (enhancedOptions['data']) {
				params['data'] = enhancedOptions['data']
			}

			// Gas pricing - shouldn't mix legacy and EIP-1559
			if (enhancedOptions['gasPrice']) {
				params['gasPrice'] = parseBigInt(enhancedOptions['gasPrice'])
			} else {
				if (enhancedOptions['maxFeePerGas']) {
					params['maxFeePerGas'] = parseBigInt(enhancedOptions['maxFeePerGas'])
				}

				if (enhancedOptions['maxPriorityFeePerGas']) {
					params['maxPriorityFeePerGas'] = parseBigInt(enhancedOptions['maxPriorityFeePerGas'])
				}
			}

			// Transaction details
			if (enhancedOptions['to']) {
				params['to'] = enhancedOptions['to']
			}

			if (enhancedOptions['value']) {
				params['value'] = parseBigInt(enhancedOptions['value'])
			}

			return params
		},

		// Execute the action
		executeAction: async (client: any, params: any): Promise<any> => {
			return await client.createAccessList(params)
		},
	})

	// If editor is active, render nothing
	if (actionResult.editorActive) {
		return null
	}

	return (
		<CliAction
			{...actionResult}
			targetName={`transaction to ${actionResult.options['to'] || '0x7099...c8'}`}
			successMessage="Access list created successfully!"
		/>
	)
}
