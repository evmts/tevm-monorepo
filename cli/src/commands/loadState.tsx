import type { LoadStateParams, LoadStateResult } from '@tevm/actions'
import { option } from 'pastel'
import { z } from 'zod'
import CliAction from '../components/CliAction.js'
import { envVar, useAction } from '../hooks/useAction.js'

// Add command description for help output
export const description = 'Load a saved blockchain state from a file into the current node'

// Options definitions and descriptions
const optionDescriptions = {
	rpc: 'RPC endpoint (env: TEVM_RPC)',
	stateFile: 'Path to JSON file containing the TEVM state (env: TEVM_STATE_FILE)',
	stateJson: 'JSON string containing the TEVM state (env: TEVM_STATE_JSON)',
}

// Empty args tuple
export const args = z.tuple([])

export const options = z.object({
	// Interactive mode flag (run directly without interactive editor)
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
		.default(envVar('rpc') || 'http://localhost:8545')
		.describe(
			option({
				description: optionDescriptions.rpc,
				defaultValueDescription: 'http://localhost:8545',
			}),
		),

	// State options - either file or JSON
	stateFile: z
		.string()
		.optional()
		.describe(
			option({
				description: optionDescriptions.stateFile,
			}),
		),
	stateJson: z
		.string()
		.optional()
		.describe(
			option({
				description: optionDescriptions.stateJson,
			}),
		),

	// Output formatting
	formatJson: z
		.boolean()
		.default(envVar('format_json') !== 'false')
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

// Default values for all parameters
const defaultValues: Record<string, any> = {
	rpc: 'http://localhost:8545',
}

// Helper function to parse state
const parseState = (options: Record<string, any>): Record<string, any> => {
	// Try stateJson first
	if (options['stateJson']) {
		try {
			return JSON.parse(options['stateJson'])
		} catch (_e) {
			throw new Error('Invalid JSON in stateJson option')
		}
	}

	// Then try stateFile - in Node.js environment
	if (options['stateFile']) {
		try {
			// In a Node.js environment, we'd use fs here
			// For the CLI, we'll use a simplified approach
			// This is a placeholder for actual file reading logic
			throw new Error('File reading not implemented in this context')
		} catch (_e) {
			throw new Error(`Could not read state file: ${options['stateFile']}`)
		}
	}

	throw new Error('Either stateFile or stateJson is required')
}

export default function LoadState({ options }: Props) {
	// Use the action hook with inlined createParams and executeAction
	const actionResult = useAction<LoadStateParams, LoadStateResult>({
		actionName: 'load-state',
		options,
		defaultValues,
		optionDescriptions,

		// Inlined createParams function - not async anymore
		createParams: (enhancedOptions: Record<string, any>): LoadStateParams => {
			// Parse the state synchronously
			const state = parseState(enhancedOptions)

			return {
				state,
			}
		},

		// Inlined executeAction function
		executeAction: async (client: any, params: LoadStateParams): Promise<LoadStateResult> => {
			return await client.tevmLoadState(params)
		},
	})

	// Render the action UI
	return <CliAction {...actionResult} targetName="load state" successMessage="State loaded successfully!" />
}
