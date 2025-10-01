import React from 'react'
import type { SetAccountParams, SetAccountResult } from '@tevm/actions'
import { option } from 'pastel'
import { z } from 'zod'
import CliAction from '../components/CliAction.js'
import { envVar, useAction } from '../hooks/useAction.js'

// Add command description for help output
export const description = 'Set account properties including balance and nonce'

// Options definitions and descriptions
const optionDescriptions = {
	address: 'Ethereum address of the account to set (env: TEVM_ADDRESS)',
	rpc: 'RPC endpoint (env: TEVM_RPC)',
	nonce: 'Account nonce (env: TEVM_NONCE)',
	balance: 'Account balance in wei (env: TEVM_BALANCE)',
	deployedBytecode: 'Contract bytecode to set account to (env: TEVM_DEPLOYED_BYTECODE)',
	storageRoot: 'Storage root to set account to (env: TEVM_STORAGE_ROOT)',
	state: 'Key-value mapping to override all slots in the account storage (env: TEVM_STATE)',
	stateDiff: 'Key-value mapping to override individual slots in the account storage (env: TEVM_STATE_DIFF)',
}

// Empty args tuple since we're using options
export const args = z.tuple([])

export const options = z.object({
	// Required address
	address: z.string().describe(
		option({
			description: optionDescriptions.address,
		}),
	),

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

	// Account properties
	nonce: z
		.string()
		.optional()
		.describe(
			option({
				description: optionDescriptions.nonce,
			}),
		),
	balance: z
		.string()
		.optional()
		.describe(
			option({
				description: optionDescriptions.balance,
			}),
		),
	deployedBytecode: z
		.string()
		.optional()
		.describe(
			option({
				description: optionDescriptions.deployedBytecode,
			}),
		),
	storageRoot: z
		.string()
		.optional()
		.describe(
			option({
				description: optionDescriptions.storageRoot,
			}),
		),
	state: z
		.record(z.string(), z.string())
		.optional()
		.describe(
			option({
				description: optionDescriptions.state,
			}),
		),
	stateDiff: z
		.record(z.string(), z.string())
		.optional()
		.describe(
			option({
				description: optionDescriptions.stateDiff,
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
	nonce: BigInt(0),
	balance: BigInt(0),
	rpc: 'http://localhost:8545',
}

export default function SetAccount({ options }: Props) {
	// Use the action hook with inlined createParams and executeAction
	const actionResult = useAction<SetAccountParams, SetAccountResult>({
		actionName: 'set-account',
		options,
		defaultValues,
		optionDescriptions,

		// Inlined createParams function
		createParams: (enhancedOptions: Record<string, any>): SetAccountParams => {
			const targetAddress = enhancedOptions['address'] as `0x${string}`

			if (!targetAddress) {
				throw new Error('Address is required')
			}

			return {
				address: targetAddress,

				// Account properties
				nonce: enhancedOptions['nonce'] ? BigInt(enhancedOptions['nonce']) : undefined,
				balance: enhancedOptions['balance'] ? BigInt(enhancedOptions['balance']) : undefined,
				deployedBytecode: enhancedOptions['deployedBytecode'] ?? undefined,
				storageRoot: enhancedOptions['storageRoot'] ?? undefined,

				// Handle state objects - ensure they're processed as Records<Hex, Hex>
				state: enhancedOptions['state']
					? typeof enhancedOptions['state'] === 'string'
						? JSON.parse(enhancedOptions['state'])
						: enhancedOptions['state']
					: undefined,

				stateDiff: enhancedOptions['stateDiff']
					? typeof enhancedOptions['stateDiff'] === 'string'
						? JSON.parse(enhancedOptions['stateDiff'])
						: enhancedOptions['stateDiff']
					: undefined,
			}
		},

		// Inlined executeAction function
		executeAction: async (client: any, params: SetAccountParams): Promise<SetAccountResult> => {
			return await client.tevmSetAccount(params)
		},
	})

	// Render the action UI
	return (
		<CliAction
			{...actionResult}
			targetName={`account ${actionResult.options['address']}`}
			successMessage="Account properties set successfully!"
		/>
	)
}
