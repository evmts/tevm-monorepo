import React from 'react'
import { z } from 'zod'
import { option } from 'pastel'
import { useAction } from '../hooks/useAction.js'
import CliAction from '../components/CliAction.js'

// Options definitions and descriptions
const optionDescriptions = {
  address: 'Account address to set nonce for (env: TEVM_ADDRESS)',
  nonce: 'Nonce value to set (env: TEVM_NONCE)',
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

  nonce: z.number().optional().describe(
    option({
      description: optionDescriptions.nonce,
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
  nonce: 1,
  rpc: 'http://localhost:8545',
}

export default function SetNonce({ options }: Props) {
  // Use the action hook
  const actionResult = useAction({
    actionName: 'setNonce',
    options,
    defaultValues,
    optionDescriptions,

    // Create params
    createParams: (enhancedOptions: Record<string, any>) => {
      return {
        address: enhancedOptions['address'] || defaultValues['address'],
        nonce: enhancedOptions['nonce'] !== undefined ? enhancedOptions['nonce'] : defaultValues['nonce'],
      };
    },

    // Execute the action
    executeAction: async (client: any, params: any): Promise<any> => {
      // Check if client has test actions
      if (!client.setNonce) {
        throw new Error('setNonce action is not available on this client. Make sure you are using an Anvil or TEVM client.');
      }
      return await client.setNonce(params);
    },
  });

  // If editor is active, render nothing
  if (actionResult.editorActive) {
    return null;
  }

  return (
    <CliAction
      {...actionResult}
      targetName={`account ${actionResult.options['address'] || '0x0000...0000'}`}
      successMessage="Account nonce set successfully!"
    />
  );
}