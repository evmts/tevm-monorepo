import { option } from 'pastel'
import { z } from 'zod'
import CliAction from '../components/CliAction.js'
import { useAction } from '../hooks/useAction.js'

// Add command description for help output
export const description = 'Get the current gas price on the Ethereum network'

// Options definitions and descriptions
const optionDescriptions = {
	rpc: 'RPC endpoint (env: TEVM_RPC)',
}

// Empty args tuple
export const args = z.tuple([])

export const options = z.object({
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
	rpc: 'http://localhost:8545',
}

export default function GetGasPrice({ options }: Props) {
	// Use the action hook
	const actionResult = useAction({
		actionName: 'getGasPrice',
		options,
		defaultValues,
		optionDescriptions,

		// Create params - getGasPrice takes no parameters
		createParams: (_enhancedOptions: Record<string, any>) => {
			return {}
		},

		// Execute the action
		executeAction: async (client: any, _params: any): Promise<any> => {
			return await client.getGasPrice()
		},
	})

	// If editor is active, render nothing
	if (actionResult.editorActive) {
		return null
	}

	return (
		<CliAction {...actionResult} targetName="current gas price" successMessage="Gas price retrieved successfully!" />
	)
}
