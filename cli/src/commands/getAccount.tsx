import React from 'react'
import { z } from 'zod'
import { option } from 'pastel'
import type { GetAccountParams, GetAccountResult } from '@tevm/actions'
import { useAction, envVar } from '../hooks/useAction.js'
import CliAction from '../components/CliAction.js'

// Add command description for help output
export const description = "Get account information including balance and nonce";

// Options definitions and descriptions
const optionDescriptions = {
  address: 'Ethereum address of the account to get (env: TEVM_ADDRESS)',
  rpc: 'RPC endpoint (env: TEVM_RPC)',
  returnStorage: 'Return account storage (can be expensive) (env: TEVM_RETURN_STORAGE)',
  blockTag: 'Block tag to fetch account from (latest, earliest, pending, etc.) (env: TEVM_BLOCK_TAG)',
}

// Empty args tuple
export const args = z.tuple([])

export const options = z.object({
  // Required address
  address: z.string().describe(
    option({
      description: optionDescriptions.address,
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

  // Account retrieval options
  returnStorage: z.boolean().default(false).describe(
    option({
      description: optionDescriptions.returnStorage,
    })
  ),
  blockTag: z.string().optional().describe(
    option({
      description: optionDescriptions.blockTag,
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
  returnStorage: false,
  blockTag: 'latest',
}

export default function GetAccount({ options }: Props) {
  // Use the action hook with inlined createParams and executeAction
  const actionResult = useAction<GetAccountParams, GetAccountResult>({
    actionName: 'get-account',
    options,
    defaultValues,
    optionDescriptions,

    // Inlined createParams function
    createParams: (enhancedOptions: Record<string, any>): GetAccountParams => {
      const targetAddress = enhancedOptions['address'] as `0x${string}`;

      if (!targetAddress) {
        throw new Error('Address is required');
      }

      return {
        address: targetAddress,
        returnStorage: enhancedOptions['returnStorage'] ?? false,
        blockTag: enhancedOptions['blockTag'] ?? undefined,
      };
    },

    // Inlined executeAction function
    executeAction: async (client: any, params: GetAccountParams): Promise<GetAccountResult> => {
      return await client.tevmGetAccount(params);
    },
  });

  // Render the action UI
  return (
    <CliAction
      {...actionResult}
      targetName={`account ${actionResult.options['address']}`}
      successMessage="Account retrieved successfully!"
    />
  );
}