import { z } from 'zod'
import { option } from 'pastel'
import { useAction } from '../hooks/useAction.js'
import CliAction from '../components/CliAction.js'

// Add command description for help output
export const description = "Create a filter for all blockchain events based on specified criteria";

// Options definitions and descriptions
const optionDescriptions = {
  address: 'Contract address to filter events from (env: TEVM_ADDRESS)',
  abi: 'Contract ABI as JSON string (env: TEVM_ABI)',
  eventName: 'Name of the event to filter (env: TEVM_EVENT_NAME)',
  args: 'Event arguments as JSON array (env: TEVM_ARGS)',
  fromBlock: 'Starting block for filtering (env: TEVM_FROM_BLOCK)',
  toBlock: 'Ending block for filtering (env: TEVM_TO_BLOCK)',
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

  abi: z.string().optional().describe(
    option({
      description: optionDescriptions.abi,
    })
  ),

  eventName: z.string().optional().describe(
    option({
      description: optionDescriptions.eventName,
    })
  ),

  args: z.string().optional().describe(
    option({
      description: optionDescriptions.args,
    })
  ),

  fromBlock: z.string().optional().describe(
    option({
      description: optionDescriptions.fromBlock,
    })
  ),

  toBlock: z.string().optional().describe(
    option({
      description: optionDescriptions.toBlock,
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

// Default Transfer event for ERC20
const DEFAULT_EVENT_ABI = {
  event: {
    inputs: [
      {
        indexed: true,
        name: 'from',
        type: 'address',
      },
      {
        indexed: true,
        name: 'to',
        type: 'address',
      },
      {
        indexed: true,
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'Transfer',
    type: 'event',
  },
};

// COMPREHENSIVE DEFAULTS
const defaultValues: Record<string, any> = {
  address: '0x0000000000000000000000000000000000000000',
  eventName: 'Transfer',
  args: '[]',
  fromBlock: 'latest',
  toBlock: 'latest',
  rpc: 'http://localhost:8545',
}

// Helper function to parse ABI
const parseAbi = (abiString?: string): any => {
  if (!abiString) return DEFAULT_EVENT_ABI;
  try {
    return JSON.parse(abiString);
  } catch (e) {
    console.warn('Warning: ABI is not valid JSON, using default Transfer event ABI');
    return DEFAULT_EVENT_ABI;
  }
};

// Helper function to parse args
const parseArgs = (argsString?: string): any[] => {
  if (!argsString) return [];
  try {
    return JSON.parse(argsString);
  } catch (e) {
    console.warn('Warning: Args is not valid JSON, using empty array');
    return [];
  }
};

// Helper function to parse block identifiers
const parseBlockIdentifier = (blockId?: string): string | bigint | undefined => {
  if (!blockId) return undefined;
  if (blockId === 'latest' || blockId === 'earliest' || blockId === 'pending' || blockId === 'safe' || blockId === 'finalized') {
    return blockId;
  }
  try {
    return BigInt(blockId);
  } catch (e) {
    console.warn(`Could not parse block identifier "${blockId}", using undefined`);
    return undefined;
  }
};

export default function CreateEventFilter({ options }: Props) {
  // Use the action hook
  const actionResult = useAction({
    actionName: 'createEventFilter',
    options,
    defaultValues,
    optionDescriptions,

    // Create params
    createParams: (enhancedOptions: Record<string, any>) => {
      const params: Record<string, any> = {
        abi: parseAbi(enhancedOptions['abi']),
      };

      // Add optional parameters
      if (enhancedOptions['address']) {
        params['address'] = enhancedOptions['address'];
      }

      if (enhancedOptions['eventName']) {
        params['eventName'] = enhancedOptions['eventName'];
      }

      if (enhancedOptions['args']) {
        params['args'] = parseArgs(enhancedOptions['args']);
      }

      // Add block range if specified
      if (enhancedOptions['fromBlock']) {
        params['fromBlock'] = parseBlockIdentifier(enhancedOptions['fromBlock']);
      }

      if (enhancedOptions['toBlock']) {
        params['toBlock'] = parseBlockIdentifier(enhancedOptions['toBlock']);
      }

      return params;
    },

    // Execute the action
    executeAction: async (client: any, params: any): Promise<any> => {
      return await client.createEventFilter(params);
    },
  });

  // If editor is active, render nothing
  if (actionResult.editorActive) {
    return null;
  }

  return (
    <CliAction
      {...actionResult}
      targetName={`${actionResult.options['eventName'] || 'all'} events on ${actionResult.options['address'] || '0x0000...0000'}`}
      successMessage="Event filter created successfully!"
    />
  );
}