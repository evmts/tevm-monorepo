import { z } from 'zod'
import { option } from 'pastel'
import type { MineParams, MineResult } from '@tevm/actions'
import { useAction, envVar } from '../hooks/useAction.js'
import CliAction from '../components/CliAction.js'

// Add command description for help output
export const description = "Mine new blocks on the blockchain (for development and testing)";

// Options definitions and descriptions
const optionDescriptions = {
  rpc: 'RPC endpoint (env: TEVM_RPC)',
  blockCount: 'Number of blocks to mine (env: TEVM_BLOCK_COUNT)',
  interval: 'Interval between block timestamps in seconds (env: TEVM_INTERVAL)',
}

// Empty args tuple
export const args = z.tuple([])

export const options = z.object({
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

  // Mining options
  blockCount: z.number().optional().describe(
    option({
      description: optionDescriptions.blockCount,
    })
  ),
  interval: z.number().optional().describe(
    option({
      description: optionDescriptions.interval,
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

// Default values for all parameters
const defaultValues: Record<string, any> = {
  rpc: 'http://localhost:8545',
  blockCount: 1,
  interval: 1,
}

export default function Mine({ options }: Props) {
  // Use the action hook with inlined createParams and executeAction
  const actionResult = useAction<MineParams, MineResult>({
    actionName: 'mine',
    options,
    defaultValues,
    optionDescriptions,

    // Inlined createParams function
    createParams: (enhancedOptions: Record<string, any>): MineParams => {
      return {
        blockCount: enhancedOptions['blockCount'] ?? 1,
        interval: enhancedOptions['interval'] ?? 1,
      };
    },

    // Inlined executeAction function
    executeAction: async (client: any, params: MineParams): Promise<MineResult> => {
      return await client.tevmMine(params);
    },
  });

  // Render the action UI
  return (
    <CliAction
      {...actionResult}
      targetName={`mine ${actionResult.options['blockCount'] || 1} block(s)`}
      successMessage="Mining completed successfully!"
    />
  );
}