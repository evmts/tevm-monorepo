import React from 'react'
import { z } from 'zod'
import { option } from 'pastel'
import type { CallParams, CallResult } from '@tevm/actions'
import { useAction, envVar } from '../../hooks/useAction.js'
import CliAction from '../../components/CliAction.js'

// Options definitions and descriptions
const optionDescriptions = {
  to: 'Contract address to call (env: TEVM_TO)',
  rpc: 'RPC endpoint (env: TEVM_RPC)',
  data: 'Transaction data (hex encoded) (env: TEVM_DATA)',
  from: 'Address to send the transaction from (env: TEVM_FROM)',
  value: 'ETH value to send in wei (env: TEVM_VALUE)',
  code: 'The encoded code to deploy (with constructor args) (env: TEVM_CODE)',
  deployedBytecode: 'Deployed bytecode to put in state before call (env: TEVM_DEPLOYED_BYTECODE)',
  salt: 'CREATE2 salt (hex encoded) (env: TEVM_SALT)',
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

// Empty args tuple since we're moving "to" to options
export const args = z.tuple([])

export const options = z.object({
  // Contract address
  to: z.string().default(envVar('to') || '0x0000000000000000000000000000000000000000').describe(
    option({
      description: optionDescriptions.to,
      defaultValueDescription: '0x0000000000000000000000000000000000000000',
    })
  ),

  // Interactive mode flag (run directly without interactive editor)
  run: z.boolean().default(false).describe(
    option({
      description: 'Run directly without interactive parameter editing (env: TEVM_RUN)',
      alias: 'r',
    })
  ),

  // Transport options
  rpc: z.string().default(envVar('rpc') || 'http://localhost:8545').describe(
    option({
      description: optionDescriptions.rpc,
      defaultValueDescription: 'http://localhost:8545',
    })
  ),

  // Basic call parameters
  data: z.string().optional().describe(
    option({
      description: optionDescriptions.data,
    })
  ),
  from: z.string().default(envVar('from') || '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266').describe(
    option({
      description: optionDescriptions.from,
      defaultValueDescription: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
    })
  ),
  value: z.string().optional().describe(
    option({
      description: optionDescriptions.value,
    })
  ),

  // Contract deployment options
  code: z.string().optional().describe(
    option({
      description: optionDescriptions.code,
    })
  ),
  deployedBytecode: z.string().optional().describe(
    option({
      description: optionDescriptions.deployedBytecode,
    })
  ),
  salt: z.string().optional().describe(
    option({
      description: optionDescriptions.salt,
    })
  ),

  // Gas parameters
  gas: z.string().optional().describe(
    option({
      description: optionDescriptions.gas,
    })
  ),
  gasPrice: z.string().optional().describe(
    option({
      description: optionDescriptions.gasPrice,
    })
  ),
  maxFeePerGas: z.string().optional().describe(
    option({
      description: optionDescriptions.maxFeePerGas,
    })
  ),
  maxPriorityFeePerGas: z.string().optional().describe(
    option({
      description: optionDescriptions.maxPriorityFeePerGas,
    })
  ),
  gasRefund: z.string().optional().describe(
    option({
      description: optionDescriptions.gasRefund,
    })
  ),

  // Block options
  blockTag: z.string().optional().describe(
    option({
      description: optionDescriptions.blockTag,
    })
  ),

  // Advanced options
  caller: z.string().optional().describe(
    option({
      description: optionDescriptions.caller,
    })
  ),
  origin: z.string().optional().describe(
    option({
      description: optionDescriptions.origin,
    })
  ),
  depth: z.number().optional().describe(
    option({
      description: optionDescriptions.depth,
    })
  ),
  skipBalance: z.boolean().optional().describe(
    option({
      description: optionDescriptions.skipBalance,
    })
  ),

  // Instrumentation options
  createTrace: z.boolean().default(false).describe(
    option({
      description: optionDescriptions.createTrace,
    })
  ),
  createAccessList: z.boolean().default(false).describe(
    option({
      description: optionDescriptions.createAccessList,
    })
  ),
  createTransaction: z.enum(['on-success', 'always', 'never']).default('never').describe(
    option({
      description: optionDescriptions.createTransaction,
    })
  ),

  // Output formatting
  formatJson: z.boolean().default(envVar('format_json') !== 'false').describe(
    option({
      description: 'Format output as JSON (env: TEVM_FORMAT_JSON)',
      defaultValueDescription: 'true',
    })
  ),
})

type Props = {
  args: z.infer<typeof args>
  options: z.infer<typeof options>
}

// Default values for all parameters - now using BigInt for numeric values
const defaultValues: Record<string, any> = {
  to: '0x0000000000000000000000000000000000000000',
  from: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
  data: '0x',
  depth: 0,
  gas: BigInt(10000000),         // 10 million gas
  gasPrice: BigInt(1000000000),  // 1 gwei
  maxFeePerGas: BigInt(2000000000),  // 2 gwei
  maxPriorityFeePerGas: BigInt(1000000000),  // 1 gwei
  gasRefund: BigInt(0),
  createTrace: false,
  createAccessList: false,
  skipBalance: false,
  createTransaction: 'never',
  rpc: 'http://localhost:8545',
  value: BigInt(0),              // 0 ETH
  blockTag: 'latest',            // Latest block
}

export default function Call({ options }: Props) {
  // Use the action hook with inlined createParams and executeAction
  const actionResult = useAction<CallParams, CallResult>({
    actionName: 'call',
    options,
    defaultValues,
    optionDescriptions,

    // Inlined createParams function
    createParams: (enhancedOptions: Record<string, any>): CallParams => {
      const targetTo = enhancedOptions['to'] as `0x${string}`;

      return {
        to: targetTo,
        // Basic parameters
        data: enhancedOptions['data'] ?? undefined,
        from: enhancedOptions['from'] ?? undefined,
        value: enhancedOptions['value'] ? BigInt(enhancedOptions['value']) : undefined,

        // Contract deployment options
        code: enhancedOptions['code'] ?? undefined,
        deployedBytecode: enhancedOptions['deployedBytecode'] ?? undefined,
        salt: enhancedOptions['salt'] ?? undefined,

        // Gas parameters
        gas: enhancedOptions['gas'] ? BigInt(enhancedOptions['gas']) : undefined,
        gasPrice: enhancedOptions['gasPrice'] ? BigInt(enhancedOptions['gasPrice']) : undefined,
        maxFeePerGas: enhancedOptions['maxFeePerGas'] ? BigInt(enhancedOptions['maxFeePerGas']) : undefined,
        maxPriorityFeePerGas: enhancedOptions['maxPriorityFeePerGas'] ? BigInt(enhancedOptions['maxPriorityFeePerGas']) : undefined,
        gasRefund: enhancedOptions['gasRefund'] ? BigInt(enhancedOptions['gasRefund']) : undefined,

        // Block options
        blockTag: enhancedOptions['blockTag'] ?? undefined,

        // Advanced options
        caller: enhancedOptions['caller'] ?? undefined,
        origin: enhancedOptions['origin'] ?? undefined,
        depth: typeof enhancedOptions['depth'] === 'bigint' ? Number(enhancedOptions['depth']) : enhancedOptions['depth'],
        skipBalance: enhancedOptions['skipBalance'] ?? undefined,

        // Instrumentation options
        createTrace: enhancedOptions['createTrace'] ?? undefined,
        createAccessList: enhancedOptions['createAccessList'] ?? undefined,
        createTransaction: enhancedOptions['createTransaction'] ?? undefined,
      };
    },

    // Inlined executeAction function
    executeAction: async (client: any, params: CallParams): Promise<CallResult> => {
      return await client.tevmCall(params);
    },
  });

  // Render the action UI
  return (
    <CliAction
      {...actionResult}
      targetName={`call to ${actionResult.options['to']}`}
      successMessage="Call executed successfully!"
    />
  );
}