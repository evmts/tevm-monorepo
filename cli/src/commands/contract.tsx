import type { ContractParams, ContractResult } from '@tevm/actions'
import { option } from 'pastel'
import { z } from 'zod'
import CliAction from '../components/CliAction.js'
import { envVar, useAction } from '../hooks/useAction.js'

// Add command description for help output
export const description = 'Call a contract function with ABI and arguments'

// Options definitions and descriptions
const optionDescriptions = {
	to: 'Contract address to call (env: TEVM_TO)',
	rpc: 'RPC endpoint (env: TEVM_RPC)',
	abi: 'Contract ABI (JSON string or path to file) (env: TEVM_ABI)',
	functionName: 'Function name to call (env: TEVM_FUNCTION_NAME)',
	args: 'Arguments for the function call (JSON string array) (env: TEVM_ARGS)',
	from: 'Address to send the transaction from (env: TEVM_FROM)',
	value: 'ETH value to send in wei (env: TEVM_VALUE)',
	deployedBytecode: 'Deployed bytecode to put in state before call (env: TEVM_DEPLOYED_BYTECODE)',
	code: 'Alias for deployedBytecode (env: TEVM_CODE)',
	gas: 'Gas limit for the transaction (env: TEVM_GAS)',
	gasPrice: 'Gas price in wei (env: TEVM_GAS_PRICE)',
	maxFeePerGas: 'Maximum fee per gas (EIP-1559) (env: TEVM_MAX_FEE_PER_GAS)',
	maxPriorityFeePerGas: 'Maximum priority fee per gas (EIP-1559) (env: TEVM_MAX_PRIORITY_FEE_PER_GAS)',
	gasRefund: 'Gas refund counter (env: TEVM_GAS_REFUND)',
	blockTag: 'Block tag (latest, pending, etc.) or number (env: TEVM_BLOCK_TAG)',
	caller: 'Address that ran this code (msg.sender) (env: TEVM_CALLER)',
	origin: 'Address where the call originated from (env: TEVM_ORIGIN)',
	depth: 'Depth of EVM call stack (env: TEVM_DEPTH)',
	skipBalance: 'Skip balance check (env: TEVM_SKIP_BALANCE)',
	createTrace: 'Return a complete trace with the call (env: TEVM_CREATE_TRACE)',
	createAccessList: 'Return an access list mapping of addresses to storage keys (env: TEVM_CREATE_ACCESS_LIST)',
	createTransaction: 'Whether to update state (on-success, always, never) (env: TEVM_CREATE_TRANSACTION)',
}

// Empty args tuple
export const args = z.tuple([])

export const options = z.object({
	// Contract address
	to: z
		.string()
		.optional()
		.describe(
			option({
				description: optionDescriptions.to,
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

	// Contract parameters
	abi: z.string().describe(
		option({
			description: optionDescriptions.abi,
		}),
	),
	functionName: z.string().describe(
		option({
			description: optionDescriptions.functionName,
		}),
	),
	args: z
		.string()
		.optional()
		.describe(
			option({
				description: optionDescriptions.args,
			}),
		),

	// Basic call parameters
	from: z
		.string()
		.default(envVar('from') || '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266')
		.describe(
			option({
				description: optionDescriptions.from,
				defaultValueDescription: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
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

	// Contract code options
	deployedBytecode: z
		.string()
		.optional()
		.describe(
			option({
				description: optionDescriptions.deployedBytecode,
			}),
		),
	code: z
		.string()
		.optional()
		.describe(
			option({
				description: optionDescriptions.code,
			}),
		),

	// Gas parameters
	gas: z
		.string()
		.optional()
		.describe(
			option({
				description: optionDescriptions.gas,
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
	gasRefund: z
		.string()
		.optional()
		.describe(
			option({
				description: optionDescriptions.gasRefund,
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

	// Advanced options
	caller: z
		.string()
		.optional()
		.describe(
			option({
				description: optionDescriptions.caller,
			}),
		),
	origin: z
		.string()
		.optional()
		.describe(
			option({
				description: optionDescriptions.origin,
			}),
		),
	depth: z
		.number()
		.optional()
		.describe(
			option({
				description: optionDescriptions.depth,
			}),
		),
	skipBalance: z
		.boolean()
		.optional()
		.describe(
			option({
				description: optionDescriptions.skipBalance,
			}),
		),

	// Instrumentation options
	createTrace: z
		.boolean()
		.default(false)
		.describe(
			option({
				description: optionDescriptions.createTrace,
			}),
		),
	createAccessList: z
		.boolean()
		.default(false)
		.describe(
			option({
				description: optionDescriptions.createAccessList,
			}),
		),
	createTransaction: z
		.enum(['on-success', 'always', 'never'])
		.default('never')
		.describe(
			option({
				description: optionDescriptions.createTransaction,
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
	from: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
	gas: BigInt(10000000), // 10 million gas
	gasPrice: BigInt(1000000000), // 1 gwei
	maxFeePerGas: BigInt(2000000000), // 2 gwei
	maxPriorityFeePerGas: BigInt(1000000000), // 1 gwei
	gasRefund: BigInt(0),
	createTrace: false,
	createAccessList: false,
	skipBalance: false,
	createTransaction: 'never',
	rpc: 'http://localhost:8545',
	value: BigInt(0),
	blockTag: 'latest',
	depth: 0,
}

// Helper function to parse ABI from string (either JSON or file path)
const parseAbi = (abiString: string) => {
	try {
		// Try parsing as JSON first
		return JSON.parse(abiString)
	} catch (_e) {
		// If JSON parsing fails, try reading from file (would require fs module in Node.js)
		// For browser CLI, we'd need to handle this differently
		throw new Error('ABI must be a valid JSON string. File reading not supported in this context.')
	}
}

// Helper function to parse function arguments
const parseArgs = (argsString?: string) => {
	if (!argsString) return []
	try {
		return JSON.parse(argsString)
	} catch (_e) {
		throw new Error('Arguments must be a valid JSON array string')
	}
}

export default function Contract({ options }: Props) {
	// Use the action hook with inlined createParams and executeAction
	const actionResult = useAction<ContractParams, ContractResult>({
		actionName: 'contract',
		options,
		defaultValues,
		optionDescriptions,

		// Inlined createParams function
		createParams: (enhancedOptions: Record<string, any>): ContractParams => {
			const abi = parseAbi(enhancedOptions['abi'])
			const functionName = enhancedOptions['functionName']
			const args = parseArgs(enhancedOptions['args'])

			if (!abi) {
				throw new Error('ABI is required')
			}

			if (!functionName) {
				throw new Error('Function name is required')
			}

			// Handle contract address and code options
			const to = enhancedOptions['to'] as `0x${string}` | undefined
			const code = enhancedOptions['code'] as `0x${string}` | undefined
			const deployedBytecode = enhancedOptions['deployedBytecode'] as `0x${string}` | undefined

			if (!to && !code && !deployedBytecode) {
				throw new Error('Either to address, code, or deployedBytecode must be provided')
			}

			// Basic parameters that are the same for all variants
			const baseParams = {
				// Contract parameters
				abi,
				functionName,
				args,

				// Basic parameters
				from: enhancedOptions['from'] ?? undefined,
				value: enhancedOptions['value'] ? BigInt(enhancedOptions['value']) : undefined,

				// Gas parameters
				gas: enhancedOptions['gas'] ? BigInt(enhancedOptions['gas']) : undefined,
				gasPrice: enhancedOptions['gasPrice'] ? BigInt(enhancedOptions['gasPrice']) : undefined,
				maxFeePerGas: enhancedOptions['maxFeePerGas'] ? BigInt(enhancedOptions['maxFeePerGas']) : undefined,
				maxPriorityFeePerGas: enhancedOptions['maxPriorityFeePerGas']
					? BigInt(enhancedOptions['maxPriorityFeePerGas'])
					: undefined,
				gasRefund: enhancedOptions['gasRefund'] ? BigInt(enhancedOptions['gasRefund']) : undefined,

				// Block options
				blockTag: enhancedOptions['blockTag'] ?? undefined,

				// Advanced options
				caller: enhancedOptions['caller'] ?? undefined,
				origin: enhancedOptions['origin'] ?? undefined,
				depth:
					typeof enhancedOptions['depth'] === 'bigint' ? Number(enhancedOptions['depth']) : enhancedOptions['depth'],
				skipBalance: enhancedOptions['skipBalance'] ?? undefined,

				// Instrumentation options
				createTrace: enhancedOptions['createTrace'] ?? undefined,
				createAccessList: enhancedOptions['createAccessList'] ?? undefined,
				createTransaction: enhancedOptions['createTransaction'] ?? undefined,
			}

			// Handle the union types according to ContractParams definition
			// Case 1: to is required, deployedBytecode and code are optional
			if (to) {
				return {
					...baseParams,
					to,
					deployedBytecode,
					code,
				} as ContractParams
			}

			// Case 2: code is required, to and deployedBytecode are optional
			if (code) {
				return {
					...baseParams,
					to,
					code,
					deployedBytecode,
				} as ContractParams
			}

			// Case 3: deployedBytecode is required, to and code are optional
			if (deployedBytecode) {
				return {
					...baseParams,
					to,
					deployedBytecode,
					code,
				} as ContractParams
			}

			// This should never happen due to the earlier check
			throw new Error('Either to address, code, or deployedBytecode must be provided')
		},

		// Inlined executeAction function
		executeAction: async (client: any, params: ContractParams): Promise<ContractResult> => {
			return await client.tevmContract(params)
		},
	})

	// Render the action UI
	return (
		<CliAction
			{...actionResult}
			targetName={`contract ${actionResult.options['to'] || 'code'} function ${actionResult.options['functionName']}`}
			successMessage="Contract function called successfully!"
		/>
	)
}
