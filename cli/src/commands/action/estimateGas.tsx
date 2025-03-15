import React from 'react'
import { z } from 'zod'
import { option } from 'pastel'
import { useAction, envVar } from '../../hooks/useAction.js'
import CliAction from '../../components/CliAction.js'

// Options definitions and descriptions
const optionDescriptions = {
  to: 'Target contract address (env: TEVM_TO)',
  from: 'Address to send the transaction from (env: TEVM_FROM)',
  data: 'Transaction data (hex encoded) (env: TEVM_DATA)',
  value: 'ETH value to send in wei (env: TEVM_VALUE)',
  nonce: 'Transaction nonce (env: TEVM_NONCE)',
  gas: 'Gas limit for the transaction (env: TEVM_GAS)',
  gasPrice: 'Gas price in wei (env: TEVM_GAS_PRICE)',
  maxFeePerGas: 'Maximum fee per gas (EIP-1559) (env: TEVM_MAX_FEE_PER_GAS)',
  maxPriorityFeePerGas: 'Maximum priority fee per gas (EIP-1559) (env: TEVM_MAX_PRIORITY_FEE_PER_GAS)',
  rpc: 'RPC endpoint (env: TEVM_RPC)',
  blockTag: 'Block tag (latest, pending, etc.) or number (env: TEVM_BLOCK_TAG)',
  blockNumber: 'Block number (env: TEVM_BLOCK_NUMBER)',
  type: 'Transaction type (0 = legacy, 1 = eip2930, 2 = eip1559) (env: TEVM_TYPE)',
  accessList: 'EIP-2930 access list (env: TEVM_ACCESS_LIST)',
}

// Empty args tuple
export const args = z.tuple([])

export const options = z.object({
  // Contract address - optional with improved description
  to: z.string().optional().describe(
    option({
      description: optionDescriptions.to,
    })
  ),

  // Interactive mode flag
  run: z.boolean().default(false).describe(
    option({
      description: 'Run directly without interactive parameter editing (env: TEVM_RUN)',
      alias: 'r',
    })
  ),

  // Transaction parameters - all optional
  from: z.string().optional().describe(
    option({
      description: optionDescriptions.from,
    })
  ),
  data: z.string().optional().describe(
    option({
      description: optionDescriptions.data,
    })
  ),
  value: z.string().optional().describe(
    option({
      description: optionDescriptions.value,
    })
  ),
  nonce: z.number().optional().describe(
    option({
      description: optionDescriptions.nonce,
    })
  ),

  // Gas parameters - all optional
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

  // Transport options with default
  rpc: z.string().default(envVar('rpc') || 'http://localhost:8545').describe(
    option({
      description: optionDescriptions.rpc,
      defaultValueDescription: 'http://localhost:8545',
    })
  ),

  // Block options - all optional
  blockTag: z.string().optional().describe(
    option({
      description: optionDescriptions.blockTag,
    })
  ),
  blockNumber: z.number().optional().describe(
    option({
      description: optionDescriptions.blockNumber,
    })
  ),

  // Transaction type options - all optional
  type: z.enum(['0', '1', '2']).optional().describe(
    option({
      description: optionDescriptions.type,
    })
  ),
  accessList: z.string().optional().describe(
    option({
      description: optionDescriptions.accessList,
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

// Comprehensive default values for estimateGas
const defaultValues: Record<string, any> = {
  // Default addresses
  to: '0x0000000000000000000000000000000000000000',
  from: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', // Default Hardhat account

  // Default transaction values
  data: '0x', // Empty calldata
  value: '0', // Zero ETH value
  nonce: 0,

  // Default gas values
  gas: '100000', // 100k gas limit
  gasPrice: '1000000000', // 1 gwei

  // Default chain interaction
  rpc: 'http://localhost:8545',
  blockTag: 'latest',

  // Default transaction type
  type: '2', // EIP-1559 transaction
}

// Helper function to safely parse BigInt values
const safeBigInt = (value?: string | number): bigint | undefined => {
  if (value === undefined || value === '') return undefined;
  try {
    return BigInt(value.toString());
  } catch (e) {
    console.warn(`Warning: Could not convert "${value}" to BigInt`);
    return undefined;
  }
};

// Helper function to parse access list
const parseAccessList = (accessListString?: string) => {
  if (!accessListString) return undefined;
  try {
    return JSON.parse(accessListString);
  } catch (e) {
    console.warn('Warning: Access list is not valid JSON, ignoring');
    return undefined;
  }
};

export default function EstimateGas({ options }: Props) {
  // Use the action hook for estimateGas
  const actionResult = useAction({
    actionName: 'estimateGas',
    options,
    defaultValues,
    optionDescriptions,

    // Create params for estimateGas
    createParams: (enhancedOptions: Record<string, any>) => {
      // Start with base params
      const params: Record<string, any> = {
        to: enhancedOptions['to'],
        from: enhancedOptions['from'],
        data: enhancedOptions['data'] || '0x',
      };

      // Add numeric values as BigInt
      if (enhancedOptions['value'] !== undefined) {
        params['value'] = safeBigInt(enhancedOptions['value']);
      }

      if (enhancedOptions['gas'] !== undefined) {
        params['gas'] = safeBigInt(enhancedOptions['gas']);
      }

      if (enhancedOptions['gasPrice'] !== undefined) {
        params['gasPrice'] = safeBigInt(enhancedOptions['gasPrice']);
      }

      if (enhancedOptions['maxFeePerGas'] !== undefined) {
        params['maxFeePerGas'] = safeBigInt(enhancedOptions['maxFeePerGas']);
      }

      if (enhancedOptions['maxPriorityFeePerGas'] !== undefined) {
        params['maxPriorityFeePerGas'] = safeBigInt(enhancedOptions['maxPriorityFeePerGas']);
      }

      // Add other non-BigInt values
      if (enhancedOptions['nonce'] !== undefined) {
        params['nonce'] = enhancedOptions['nonce'];
      }

      if (enhancedOptions['blockTag'] !== undefined) {
        params['blockTag'] = enhancedOptions['blockTag'];
      }

      if (enhancedOptions['blockNumber'] !== undefined) {
        params['blockNumber'] = enhancedOptions['blockNumber'];
      }

      if (enhancedOptions['type'] !== undefined) {
        params['type'] = enhancedOptions['type'];
      }

      if (enhancedOptions['accessList'] !== undefined) {
        params['accessList'] = parseAccessList(enhancedOptions['accessList']);
      }

      return params;
    },

    // Execute estimateGas action
    executeAction: async (client: any, params: any): Promise<any> => {
      return await client.estimateGas(params);
    },
  });

  // If editor is active, render nothing to give full control to the editor
  if (actionResult.editorActive) {
    return null;
  }

  // Render the action UI
  return (
    <CliAction
      {...actionResult}
      targetName={`transaction to ${actionResult.options['to'] || '0x0000...0000'}`}
      successMessage="Gas estimation completed successfully!"
    />
  );
}