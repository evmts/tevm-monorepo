import React from 'react'
import { z } from 'zod'
import { option } from 'pastel'
import { useAction } from '../hooks/useAction.js'
import CliAction from '../components/CliAction.js'

// Add command description for help output
export const description = "Read data from a contract by calling a read-only function";

// Options definitions and descriptions
const optionDescriptions = {
  address: 'Contract address (env: TEVM_ADDRESS)',
  abi: 'Contract ABI as JSON string (env: TEVM_ABI)',
  functionName: 'Function name to call (env: TEVM_FUNCTION_NAME)',
  args: 'Function arguments as JSON array (env: TEVM_ARGS)',
  rpc: 'RPC endpoint (env: TEVM_RPC)',
  blockTag: 'Block tag (latest, pending, etc.) or number (env: TEVM_BLOCK_TAG)',
  blockNumber: 'Block number (env: TEVM_BLOCK_NUMBER)',
}

// Empty args tuple
export const args = z.tuple([])

export const options = z.object({
  // ALL PARAMETERS OPTIONAL
  address: z.string().optional().describe(
    option({
      description: optionDescriptions.address,
    })
  ),

  abi: z.string().optional().describe(
    option({
      description: optionDescriptions.abi,
    })
  ),

  functionName: z.string().optional().describe(
    option({
      description: optionDescriptions.functionName,
    })
  ),

  args: z.string().optional().describe(
    option({
      description: optionDescriptions.args,
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

  // Block options
  blockTag: z.string().optional().describe(
    option({
      description: optionDescriptions.blockTag,
      defaultValueDescription: 'latest',
    })
  ),

  blockNumber: z.number().optional().describe(
    option({
      description: optionDescriptions.blockNumber,
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

// COMPREHENSIVE DEFAULTS FOR ALL PARAMETERS
const defaultValues: Record<string, any> = {
  address: '0x0000000000000000000000000000000000000000', // Zero address
  // abi - we'll explicitly use ERC20.abi from 'tevm/contract' in the TS script
  functionName: 'balanceOf', // Common ERC20 function
  args: '["0x0000000000000000000000000000000000000000"]', // Default to checking zero address balance
  rpc: 'http://localhost:8545',
  blockTag: 'latest',
  formatJson: true,
}

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

// Define a fallback ERC20 ABI to use when the import fails
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

// Use fallback ERC20 ABI directly
const getErc20Abi = async () => {
  try {
    // Just return the fallback ABI directly instead of trying to import
    return fallbackERC20Abi;
  } catch (e) {
    console.warn('Failed to load ERC20 ABI, using fallback');
    return fallbackERC20Abi;
  }
};

export default function ReadContract({ options }: Props) {
  // Use the action hook for readContract
  const actionResult = useAction({
    actionName: 'readContract',
    options,
    defaultValues,
    optionDescriptions,

    // Create params for readContract - this is used for direct API calls (run flag)
    createParams: async (enhancedOptions: Record<string, any>) => {
      // Get ERC20 ABI (from module or fallback)
      let abi;
      try {
        // Just use the fallback ABI directly
        abi = fallbackERC20Abi;
      } catch (e) {
        console.warn('Failed to load ERC20 ABI, using fallback');
        abi = fallbackERC20Abi;
      }

      const params: Record<string, any> = {
        address: enhancedOptions['address'] || defaultValues['address'],
        functionName: enhancedOptions['functionName'] || defaultValues['functionName'],
        abi: enhancedOptions['abi'] || abi, // Make sure abi is included
        args: enhancedOptions['args'] || defaultValues['args'],
      };

      // Add block identifier if specified
      if (enhancedOptions['blockNumber']) {
        params['blockNumber'] = parseBlockNumber(enhancedOptions['blockNumber']);
      } else if (enhancedOptions['blockTag']) {
        params['blockTag'] = enhancedOptions['blockTag'];
      }

      return params;
    },

    // Execute readContract action
    executeAction: async (client: any, params: any): Promise<any> => {
      // If no ABI is provided, use the stub ERC20_ABI
      if (!params['abi']) {
        try {
          // Try to dynamically import, but have a fallback
          const abi = await getErc20Abi();
          params['abi'] = abi;
        } catch (e) {
          console.error('Failed to set ERC20 ABI:', e);
          throw new Error('Could not load default ERC20 ABI');
        }
      }

      return await client.readContract(params);
    },
  });

  // If editor is active, render nothing
  if (actionResult.editorActive) {
    return null;
  }

  // Render the action UI
  return (
    <CliAction
      {...actionResult}
      targetName={`contract at ${actionResult.options['address'] || '0x0000...0000'}`}
      successMessage="Contract read successfully!"
    />
  );
}