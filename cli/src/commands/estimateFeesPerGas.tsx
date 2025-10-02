import { option } from 'pastel'
import { z } from 'zod'
import CliAction from '../components/CliAction.js'
import { useAction } from '../hooks/useAction.js'

// Add command description for help output
export const description = 'Estimate the fee per gas for a transaction (EIP-1559 compatible)'

// Options definitions and descriptions
const optionDescriptions = {
	rpc: 'RPC endpoint (env: TEVM_RPC)',
	type: 'Transaction type (env: TEVM_TYPE)',
}

// Empty args tuple
export const args = z.tuple([])

export const options = z.object({
	// ALL PARAMETERS OPTIONAL
	type: z
		.string()
		.optional()
		.describe(
			option({
				description: optionDescriptions.type,
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
	type: 'eip1559',
	rpc: 'http://localhost:8545',
}

export default function EstimateFeesPerGas({ options }: Props) {
	// Use the action hook
	const actionResult = useAction({
		actionName: 'estimateFeesPerGas',
		options,
		defaultValues,
		optionDescriptions,

		// Create params
		createParams: (enhancedOptions: Record<string, any>) => {
			const params: Record<string, any> = {}

			if (enhancedOptions['type']) {
				params['type'] = enhancedOptions['type']
			}

			return params
		},

		// Execute the action
		executeAction: async (client: any, params: any): Promise<any> => {
			return await client.estimateFeesPerGas(params)
		},
	})

	// If editor is active, render nothing
	if (actionResult.editorActive) {
		return null
	}

	return (
		<CliAction
			{...actionResult}
			targetName={`fees for ${actionResult.options['type'] || 'eip1559'} transactions`}
			successMessage="Fee estimation completed successfully!"
		/>
	)
}
