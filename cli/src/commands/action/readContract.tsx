import React from 'react'
import { z } from 'zod'
import { option } from 'pastel'
import { useAction, envVar } from '../../hooks/useAction.js'
import CliAction from '../../components/CliAction.js'

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

// Helper function to parse args
const parseArgs = (argsString?: string) => {
  if (!argsString) return [];

  try {
    return JSON.parse(argsString);
  } catch (e) {
    console.warn('Warning: Args is not valid JSON, using empty array');
    return [];
  }
};

// Option 1: Define a stub ERC20 ABI
const ERC20_ABI = [
  {
    "inputs": [
      { "name": "account", "type": "address" }
    ],
    "name": "balanceOf",
    "outputs": [
      { "name": "", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

export default function ReadContract({ options }: Props) {
  // Use the action hook for readContract
  const actionResult = useAction({
    actionName: 'readContract',
    options,
    defaultValues,
    optionDescriptions,

    // Create params for readContract - this is used for direct API calls (run flag)
    createParams: (enhancedOptions: Record<string, any>) => {
      // Start with base params
      const params: Record<string, any> = {
        address: enhancedOptions['address'] || defaultValues['address'],
        functionName: enhancedOptions['functionName'] || defaultValues['functionName'],
      };

      // Parse args or use default
      if (enhancedOptions['args']) {
        params['args'] = parseArgs(enhancedOptions['args']);
      } else {
        params['args'] = ['0x0000000000000000000000000000000000000000'];
      }

      // Add optional parameters if they exist
      if (enhancedOptions['blockTag']) params['blockTag'] = enhancedOptions['blockTag'];
      if (enhancedOptions['blockNumber'] !== undefined) params['blockNumber'] = enhancedOptions['blockNumber'];

      // Handle ABI
      if (enhancedOptions['abi']) {
        try {
          params['abi'] = JSON.parse(enhancedOptions['abi']);
        } catch (e) {
          console.warn('Invalid ABI JSON, will use default ERC20 ABI');
        }
      }

      return params;
    },

    // Execute readContract action
    executeAction: async (client: any, params: any): Promise<any> => {
      // If no ABI is provided, use the stub ERC20_ABI
      if (!params['abi']) {
        try {
          // Try to dynamically import, but have a fallback
          let abi;
          try {
            const module = await import('@tevm/contract');
            abi = module.ERC20.abi;
          } catch (e) {
            console.warn('Could not import @tevm/contract, using stub ERC20 ABI');
            abi = ERC20_ABI;
          }
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