import { writeFileSync } from 'node:fs'
import type { DumpStateParams, DumpStateResult } from '@tevm/actions'
import { option } from 'pastel'
import { z } from 'zod'
import CliAction from '../components/CliAction.js'
import { envVar, useAction } from '../hooks/useAction.js'

// Add command description for help output
export const description = 'Dump the current state of the blockchain to a file'

// Options definitions and descriptions
const optionDescriptions = {
	rpc: 'RPC endpoint (env: TEVM_RPC)',
	blockTag: 'Block tag to dump state from (latest, earliest, pending, etc.) (env: TEVM_BLOCK_TAG)',
	outputFile: 'Optional file path to save the state to (env: TEVM_OUTPUT_FILE)',
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

	// Block options
	blockTag: z
		.string()
		.optional()
		.describe(
			option({
				description: optionDescriptions.blockTag,
			}),
		),

	// Output options
	outputFile: z
		.string()
		.optional()
		.describe(
			option({
				description: optionDescriptions.outputFile,
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
	blockTag: 'latest',
}

export default function DumpState({ options }: Props) {
	// Use the action hook with inlined createParams and executeAction
	const actionResult = useAction<DumpStateParams, DumpStateResult>({
		actionName: 'dump-state',
		options,
		defaultValues,
		optionDescriptions,

		// Inlined createParams function
		createParams: (enhancedOptions: Record<string, any>): DumpStateParams => {
			return {
				blockTag: enhancedOptions['blockTag'] ?? undefined,
			}
		},

		// Inlined executeAction function
		executeAction: async (client: any, params: DumpStateParams): Promise<DumpStateResult> => {
            const result = await client.tevmDumpState(params)

            const outputFile = options.outputFile
            if (outputFile && result.state) {
                try {
                    writeFileSync(outputFile, `${JSON.stringify(result.state, null, 2)}\n`)
                } catch (error) {
                    const message = error instanceof Error ? error.message : String(error)
                    throw new Error(`Failed to write state to file ${outputFile}: ${message}`)
                }
            }

            return result
		},
	})

	// Render the action UI
	return <CliAction {...actionResult} targetName="dump state" successMessage="State dumped successfully!" />
}
