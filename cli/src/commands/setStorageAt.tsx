import { z } from 'zod'
import { option } from 'pastel'
import { useAction } from '../hooks/useAction.js'
import CliAction from '../components/CliAction.js'

// Add command description for help output
export const description = "Set the storage value at a specific slot for a contract address";

// Options definitions and descriptions
const optionDescriptions = {
  address: 'Contract address to set storage for (env: TEVM_ADDRESS)',
  index: 'Storage slot index (env: TEVM_INDEX)',
  value: 'Value to set at the storage slot (env: TEVM_VALUE)',
  rpc: 'RPC endpoint (env: TEVM_RPC)',
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

  index: z.string().optional().describe(
    option({
      description: optionDescriptions.index,
    })
  ),

  value: z.string().optional().describe(
    option({
      description: optionDescriptions.value,
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
  address: '0x0000000000000000000000000000000000000000',
  index: '0x0',
  value: '0x1',
  rpc: 'http://localhost:8545',
}

// Helper function to ensure hex format
const ensureHex = (value?: string): string => {
  if (!value) return '0x0';

  if (value.startsWith('0x')) {
    return value;
  }

  try {
    // Try to convert number to hex
    const num = BigInt(value);
    return `0x${num.toString(16)}`;
  } catch (e) {
    // If not a number, return as hex string
    return `0x${value}`;
  }
};

export default function SetStorageAt({ options }: Props) {
  // Use the action hook
  const actionResult = useAction({
    actionName: 'setStorageAt',
    options,
    defaultValues,
    optionDescriptions,

    // Create params
    createParams: (enhancedOptions: Record<string, any>) => {
      // Parse index to number if possible
      let index = enhancedOptions['index'] || defaultValues['index'];
      if (typeof index === 'string' && index.startsWith('0x')) {
        try {
          index = parseInt(index, 16);
        } catch (e) {
          // If parsing fails, keep as string
        }
      }

      return {
        address: enhancedOptions['address'] || defaultValues['address'],
        index,
        value: ensureHex(enhancedOptions['value'] || defaultValues['value']),
      };
    },

    // Execute the action
    executeAction: async (client: any, params: any): Promise<any> => {
      // Check if client has test actions
      if (!client.setStorageAt) {
        throw new Error('setStorageAt action is not available on this client. Make sure you are using an Anvil or TEVM client.');
      }
      return await client.setStorageAt(params);
    },
  });

  // If editor is active, render nothing
  if (actionResult.editorActive) {
    return null;
  }

  return (
    <CliAction
      {...actionResult}
      targetName={`storage slot ${actionResult.options['index'] || '0x0'} at ${actionResult.options['address'] || '0x0000...0000'}`}
      successMessage="Storage value set successfully!"
    />
  );
}