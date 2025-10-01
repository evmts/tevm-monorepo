import React from 'react'
import { z } from 'zod'
import CliAction from '../components/CliAction.js'
import { useAction } from '../hooks/useAction.js'
import { CallParams, CallResult } from '../utils/action-types.js'
import { createCallOptions } from '../utils/options.js'

// Add command description for help output
export const description = 'Execute a raw EVM call against a contract or address'

// Empty args tuple since we're using options for all parameters
export const args = z.tuple([])

// Define command options using our utility function
export const options = z.object(createCallOptions())

type Props = {
	args: z.infer<typeof args>
	options: z.infer<typeof options>
}

export default function Call({ options }: Props) {
	// Use the action hook to handle all the complexity
	const actionResult = useAction<CallParams, CallResult>({
		actionName: 'tevmCall',
		options,
		defaultValues: {
			to: '0x0000000000000000000000000000000000000000',
			from: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
			data: '0x',
			gas: BigInt(10000000),
			gasPrice: BigInt(1000000000),
			value: BigInt(0),
			blockTag: 'latest',
		},
		optionDescriptions: {
			to: 'Contract address to call',
			data: 'Transaction data (hex encoded)',
			from: 'Address to send the transaction from',
			value: 'ETH value to send in wei',
			code: 'The encoded code to deploy (with constructor args)',
			deployedBytecode: 'Deployed bytecode to put in state before call',
			gas: 'Gas limit for the transaction',
			gasPrice: 'Gas price in wei',
			blockTag: 'Block tag (latest, pending, etc.) or number',
		},

		// Convert options to call parameters
		createParams: (enhancedOptions: Record<string, any>): CallParams => {
			const params: Partial<CallParams> = {
				to: enhancedOptions['to'],
				from: enhancedOptions['from'],
				data: enhancedOptions['data'],
				code: enhancedOptions['code'],
				deployedBytecode: enhancedOptions['deployedBytecode'],
				blockTag: enhancedOptions['blockTag'],
			}

			// Convert string values to BigInt where needed
			if (enhancedOptions['value']) {
				params.value = BigInt(enhancedOptions['value'])
			}
			if (enhancedOptions['gas']) {
				params.gas = BigInt(enhancedOptions['gas'])
			}
			if (enhancedOptions['gasPrice']) {
				params.gasPrice = BigInt(enhancedOptions['gasPrice'])
			}
			if (enhancedOptions['gasRefund']) {
				params.gasRefund = BigInt(enhancedOptions['gasRefund'])
			}
			if (enhancedOptions['maxFeePerGas']) {
				params.maxFeePerGas = BigInt(enhancedOptions['maxFeePerGas'])
			}
			if (enhancedOptions['maxPriorityFeePerGas']) {
				params.maxPriorityFeePerGas = BigInt(enhancedOptions['maxPriorityFeePerGas'])
			}

			// Boolean flags
			if (enhancedOptions['createTrace']) {
				params.createTrace = true
			}
			if (enhancedOptions['createAccessList']) {
				params.createAccessList = true
			}
			if (enhancedOptions['skipBalance']) {
				params.skipBalance = true
			}
			if (enhancedOptions['createTransaction']) {
				params.createTransaction = enhancedOptions['createTransaction']
			}

			// Filter out undefined values
			return Object.fromEntries(Object.entries(params).filter(([_, v]) => v !== undefined)) as CallParams
		},

		// Execute the call against the client
		executeAction: async (client: any, params: CallParams): Promise<CallResult> => {
			return await client.tevmCall(params)
		},
	})

	// Render the action UI
	return (
		<CliAction
			{...actionResult}
			targetName={`call to ${actionResult.options['to']}`}
			successMessage="Call executed successfully!"
		/>
	)
}
