import { z } from 'zod'
import { option } from 'pastel'
import { useAction } from '../hooks/useAction.js'
import CliAction from '../components/CliAction.js'

// Add command description for help output
export const description = "Get the current block number of the blockchain";

// Options definitions and descriptions
const optionDescriptions = {
  rpc: 'RPC endpoint (env: TEVM_RPC)',
  cacheTime: 'Time in milliseconds to cache the result (env: TEVM_CACHE_TIME)',
}

// Empty args tuple
export const args = z.tuple([])

export const options = z.object({
  // ALL PARAMETERS OPTIONAL
  cacheTime: z.number().optional().describe(
    option({
      description: optionDescriptions.cacheTime,
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
  cacheTime: 0,
  rpc: 'http://localhost:8545',
}

export default function GetBlockNumber({ options }: Props) {
  // Use the action hook
  const actionResult = useAction({
    actionName: 'getBlockNumber',
    options,
    defaultValues,
    optionDescriptions,

    // Create params
    createParams: (enhancedOptions: Record<string, any>) => {
      const params: Record<string, any> = {};

      if (enhancedOptions['cacheTime'] !== undefined) {
        params['cacheTime'] = enhancedOptions['cacheTime'];
      }

      return params;
    },

    // Execute the action
    executeAction: async (client: any, params: any): Promise<any> => {
      return await client.getBlockNumber(params);
    },
  });

  // If editor is active, render nothing
  if (actionResult.editorActive) {
    return null;
  }

  return (
    <CliAction
      {...actionResult}
      targetName="current block number"
      successMessage="Block number retrieved successfully!"
    />
  );
}