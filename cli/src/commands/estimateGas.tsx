import React from 'react'
import { option } from 'pastel'
import { isAddress } from 'viem'
import { z } from 'zod'
import CliAction from '../components/CliAction.js'
import { useAction } from '../hooks/useAction.js'

// Add command description for help output
export const description = 'Estimate the gas required for a transaction to execute'

// Options definitions and descriptions
const optionDescriptions = {
	to: 'Target contract address (env: TEVM_TO)',
	from: 'Address to send the transaction from (env: TEVM_FROM)',
	data: 'Transaction data (hex encoded) (env: TEVM_DATA)',
	value: 'ETH value to send in wei (env: TEVM_VALUE)',
	gas: 'Gas limit for the transaction (env: TEVM_GAS)',
	gasPrice: 'Gas price in wei (env: TEVM_GAS_PRICE)',
	maxFeePerGas: 'Maximum fee per gas (EIP-1559) (env: TEVM_MAX_FEE_PER_GAS)',
	maxPriorityFeePerGas: 'Maximum priority fee per gas (EIP-1559) (env: TEVM_MAX_PRIORITY_FEE_PER_GAS)',
	rpc: 'RPC endpoint (env: TEVM_RPC)',
	blockTag: 'Block tag (latest, pending, etc.) or number (env: TEVM_BLOCK_TAG)',
}

// Empty args tuple
export const args = z.tuple([])

export const options = z.object({
	// ALL PARAMETERS OPTIONAL
	to: z
		.string()
		.optional()
		.refine((addr) => !addr || isAddress(addr), {
			message: 'Must be a valid Ethereum address',
		})
		.describe(
			option({
				description: optionDescriptions.to,
			}),
		),

	from: z
		.string()
		.optional()
		.refine((addr) => !addr || isAddress(addr), {
			message: 'Must be a valid Ethereum address',
		})
		.describe(
			option({
				description: optionDescriptions.from,
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

	value: z
		.bigint()
		.optional()
		.describe(
			option({
				description: optionDescriptions.value,
			}),
		),

	gas: z
		.bigint()
		.optional()
		.describe(
			option({
				description: optionDescriptions.gas,
			}),
		),

	gasPrice: z
		.bigint()
		.optional()
		.describe(
			option({
				description: optionDescriptions.gasPrice,
			}),
		),

	maxFeePerGas: z
		.bigint()
		.optional()
		.describe(
			option({
				description: optionDescriptions.maxFeePerGas,
			}),
		),

	maxPriorityFeePerGas: z
		.bigint()
		.optional()
		.describe(
			option({
				description: optionDescriptions.maxPriorityFeePerGas,
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

	// Block options
	blockTag: z
		.string()
		.optional()
		.describe(
			option({
				description: optionDescriptions.blockTag,
				defaultValueDescription: 'latest',
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
	to: '0x0000000000000000000000000000000000000000',
	from: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', // Default Hardhat account
	data: '0x', // Empty calldata
	value: '0', // Zero ETH
	gas: '100000', // 100k gas limit
	gasPrice: '1000000000', // 1 gwei
	rpc: 'http://localhost:8545',
	blockTag: 'latest',
}

// Helper function to parse BigInt values
const safeBigInt = (value?: string | bigint): bigint | undefined => {
	if (value === undefined) return undefined
	if (typeof value === 'bigint') return value

	try {
		return BigInt(value)
	} catch (_e) {
		console.warn(`Could not convert "${value}" to BigInt`)
		return undefined
	}
}

export default function EstimateGas({ options }: Props) {
	// Use the action hook
	const actionResult = useAction({
		actionName: 'estimateGas',
		options,
		defaultValues,
		optionDescriptions,

		// Create params
		createParams: (enhancedOptions: Record<string, any>) => {
			const params: Record<string, any> = {
				to: enhancedOptions['to'] || defaultValues['to'],
				from: enhancedOptions['from'] || defaultValues['from'],
				data: enhancedOptions['data'] || defaultValues['data'],
			}

			// Convert numeric values to BigInt
			if (enhancedOptions['value'] !== undefined) {
				params['value'] = safeBigInt(enhancedOptions['value'])
			}

			if (enhancedOptions['gas'] !== undefined) {
				params['gas'] = safeBigInt(enhancedOptions['gas'])
			}

			if (enhancedOptions['gasPrice'] !== undefined) {
				params['gasPrice'] = safeBigInt(enhancedOptions['gasPrice'])
			}

			if (enhancedOptions['maxFeePerGas'] !== undefined) {
				params['maxFeePerGas'] = safeBigInt(enhancedOptions['maxFeePerGas'])
			}

			if (enhancedOptions['maxPriorityFeePerGas'] !== undefined) {
				params['maxPriorityFeePerGas'] = safeBigInt(enhancedOptions['maxPriorityFeePerGas'])
			}

			// Add block parameters
			if (enhancedOptions['blockTag']) {
				params['blockTag'] = enhancedOptions['blockTag']
			}

			return params
		},

		// Execute the action
		executeAction: async (client: any, params: any): Promise<any> => {
			return await client.estimateGas(params)
		},
	})

	// If editor is active, render nothing
	if (actionResult.editorActive) {
		return null
	}

	// Render the action UI
	return (
		<CliAction
			{...actionResult}
			targetName={`transaction to ${actionResult.options['to'] || '0x0000...0000'}`}
			successMessage="Gas estimation completed successfully!"
		/>
	)
}
