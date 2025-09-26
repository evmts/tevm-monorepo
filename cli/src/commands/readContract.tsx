import { z } from 'zod'
import { option } from 'pastel'
import { useAction } from '../hooks/useAction.js'
import CliAction from '../components/CliAction.js'
import { ReadContractParams } from '../utils/action-types.js'

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
}

// Empty args tuple
export const args = z.tuple([])

export const options = z.object({
  // Contract details
  address: z.string().describe(
    option({
      description: optionDescriptions.address,
    })
  ),

  abi: z.string().describe(
    option({
      description: optionDescriptions.abi,
    })
  ),

  functionName: z.string().describe(
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
  rpc: z.string().default('http://localhost:8545').describe(
    option({
      description: optionDescriptions.rpc,
      defaultValueDescription: 'http://localhost:8545',
    })
  ),

  // Block options
  blockTag: z.string().optional().describe(
    option({
      description: optionDescriptions.blockTag,
    })
  ),

  // Output formatting
  formatJson: z.boolean().default(true).describe(
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

// Default ERC20 ABI to use as a fallback
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

export default function ReadContract({ options }: Props) {
  // Use the action hook for readContract
  const actionResult = useAction<ReadContractParams, any>({
    actionName: 'readContract',
    options,
    defaultValues: {
      blockTag: 'latest',
    },
    optionDescriptions,

    // Create params for readContract
    createParams: (enhancedOptions: Record<string, any>): ReadContractParams => {
      // Parse ABI from string
      let abi;
      try {
        abi = typeof (enhancedOptions as any).abi === 'string'
          ? JSON.parse((enhancedOptions as any).abi)
          : (enhancedOptions as any).abi || fallbackERC20Abi;
      } catch (e) {
        console.warn('Failed to parse ABI, using fallback ERC20 ABI');
        abi = fallbackERC20Abi;
      }

      // Parse arguments if provided
      let args = [];
      if ((enhancedOptions as any).args) {
        try {
          args = typeof (enhancedOptions as any).args === 'string'
            ? JSON.parse((enhancedOptions as any).args)
            : (enhancedOptions as any).args;

          // Ensure args is an array
          if (!Array.isArray(args)) {
            args = [args];
          }
        } catch (e) {
          console.warn(`Invalid arguments format: ${(e as any).message}`);
        }
      }

      // Return the params object
      return {
        address: (enhancedOptions as any).address,
        abi,
        functionName: (enhancedOptions as any).functionName,
        args,
        blockTag: (enhancedOptions as any).blockTag,
      };
    },

    // Execute readContract action
    executeAction: async (client: any, params: ReadContractParams): Promise<any> => {
      return await client.readContract(params);
    },
  });

  // Render the action UI
  return (
    <CliAction
      {...actionResult}
      targetName={`${(actionResult.options as any).functionName} at ${(actionResult.options as any).address}`}
      successMessage="Contract read successfully!"
    />
  );
}