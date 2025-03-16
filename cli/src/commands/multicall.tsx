import React from 'react'
import { z } from 'zod'
import { option } from 'pastel'
import { useAction } from '../hooks/useAction.js'
import CliAction from '../components/CliAction.js'

// Add command description for help output
export const description = "Execute multiple contract calls in a single RPC request";

// Options definitions and descriptions
const optionDescriptions = {
  contracts: 'Array of contract calls in JSON format (env: TEVM_CONTRACTS)',
  multicallAddress: 'Address of the multicall contract (env: TEVM_MULTICALL_ADDRESS)',
  allowFailure: 'Whether to allow calls to fail (env: TEVM_ALLOW_FAILURE)',
  blockTag: 'Block tag (latest, pending, etc.) (env: TEVM_BLOCK_TAG)',
  blockNumber: 'Block number to execute at (env: TEVM_BLOCK_NUMBER)',
  rpc: 'RPC endpoint (env: TEVM_RPC)',
}

// Define a fallback ERC20 ABI
const fallbackERC20Abi = [
  {
    "inputs": [],
    "name": "totalSupply",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "account", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
];

// Empty args tuple
export const args = z.tuple([])

export const options = z.object({
  // ALL PARAMETERS OPTIONAL
  contracts: z.string().optional().describe(
    option({
      description: optionDescriptions.contracts,
    })
  ),

  multicallAddress: z.string().optional().describe(
    option({
      description: optionDescriptions.multicallAddress,
    })
  ),

  allowFailure: z.boolean().optional().describe(
    option({
      description: optionDescriptions.allowFailure,
    })
  ),

  blockTag: z.string().optional().describe(
    option({
      description: optionDescriptions.blockTag,
    })
  ),

  blockNumber: z.string().optional().describe(
    option({
      description: optionDescriptions.blockNumber,
    })
  ),

  // Interactive mode flag
  run: z.boolean().default(false).describe(
    option({
      description: 'Run directly without interactive parameter editing (env: TEVM_RUN)',
      alias: 'r',
    })
  ),

  // Transport options
  rpc: z.string().optional().describe(
    option({
      description: optionDescriptions.rpc,
      defaultValueDescription: 'http://localhost:8545',
    })
  ),

  // Output formatting
  formatJson: z.boolean().optional().describe(
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

// COMPREHENSIVE DEFAULTS
const defaultValues: Record<string, any> = {
  contracts: '[]', // Empty array as default
  allowFailure: true,
  blockTag: 'latest',
  rpc: 'http://localhost:8545',
}

// Helper function to parse contracts array
const parseContracts = (contractsStr?: string): any[] => {
  if (!contractsStr) return [];
  try {
    return JSON.parse(contractsStr);
  } catch (e) {
    console.warn('Warning: Contracts is not valid JSON, using empty array');
    return [];
  }
};

// Helper function to safely parse block number
const parseBlockNumber = (blockNumber?: string): bigint | undefined => {
  if (!blockNumber) return undefined;
  try {
    return BigInt(blockNumber);
  } catch (e) {
    console.warn(`Could not convert "${blockNumber}" to BigInt`);
    return undefined;
  }
};

export default function Multicall({ options }: Props) {
  // Use the action hook
  const actionResult = useAction({
    actionName: 'multicall',
    options,
    defaultValues,
    optionDescriptions,

    // Create params
    createParams: async (enhancedOptions: Record<string, any>) => {
      // Get ERC20 ABI (from module or fallback) for any contracts that need it
      let abi;
      try {
        // Instead of trying to import a module that doesn't exist,
        // use the fallback ABI directly
        abi = fallbackERC20Abi;
      } catch (e) {
        console.warn('Failed to load ERC20 ABI, using fallback');
        abi = fallbackERC20Abi;
      }

      // Process contracts array to ensure each has an ABI
      const contracts = enhancedOptions['contracts'] || defaultValues['contracts'];
      const processedContracts = contracts.map((contract: Record<string, any>) => {
        if (!contract['abi']) {
          return { ...contract, abi };
        }
        return contract;
      });

      const params: Record<string, any> = {
        contracts: processedContracts,
      };

      // Add optional parameters
      if (enhancedOptions['multicallAddress']) {
        params['multicallAddress'] = enhancedOptions['multicallAddress'];
      }

      if (enhancedOptions['allowFailure'] !== undefined) {
        params['allowFailure'] = enhancedOptions['allowFailure'];
      }

      // Add block identifier - only one should be used
      if (enhancedOptions['blockNumber']) {
        params['blockNumber'] = parseBlockNumber(enhancedOptions['blockNumber']);
      } else if (enhancedOptions['blockTag']) {
        params['blockTag'] = enhancedOptions['blockTag'];
      }

      return params;
    },

    // Execute the action
    executeAction: async (client: any, params: any): Promise<any> => {
      return await client.multicall(params);
    },
  });

  // If editor is active, render nothing
  if (actionResult.editorActive) {
    return null;
  }

  return (
    <CliAction
      {...actionResult}
      targetName={`${parseContracts(actionResult.options['contracts']).length} contract calls`}
      successMessage="Multicall executed successfully!"
    />
  );
}