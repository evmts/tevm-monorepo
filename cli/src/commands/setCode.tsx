import React from 'react'
import { z } from 'zod'
import { option } from 'pastel'
import { useAction } from '../hooks/useAction.js'
import CliAction from '../components/CliAction.js'

// Options definitions and descriptions
const optionDescriptions = {
  address: 'Contract address to set bytecode for (env: TEVM_ADDRESS)',
  bytecode: 'Bytecode to set at the address (env: TEVM_BYTECODE)',
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

  bytecode: z.string().optional().describe(
    option({
      description: optionDescriptions.bytecode,
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

// COMPREHENSIVE DEFAULTS - simple ERC20 bytecode snippet
const defaultValues: Record<string, any> = {
  address: '0x0000000000000000000000000000000000000000',
  bytecode: '0x608060405260043610610057576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806318160ddd1461005c57',
  rpc: 'http://localhost:8545',
}

export default function SetCode({ options }: Props) {
  // Use the action hook
  const actionResult = useAction({
    actionName: 'setCode',
    options,
    defaultValues,
    optionDescriptions,

    // Create params
    createParams: (enhancedOptions: Record<string, any>) => {
      return {
        address: enhancedOptions['address'] || defaultValues['address'],
        bytecode: enhancedOptions['bytecode'] || defaultValues['bytecode'],
      };
    },

    // Execute the action
    executeAction: async (client: any, params: any): Promise<any> => {
      // Check if client has test actions
      if (!client.setCode) {
        throw new Error('setCode action is not available on this client. Make sure you are using an Anvil or TEVM client.');
      }
      return await client.setCode(params);
    },
  });

  // If editor is active, render nothing
  if (actionResult.editorActive) {
    return null;
  }

  return (
    <CliAction
      {...actionResult}
      targetName={`contract at ${actionResult.options['address'] || '0x0000...0000'}`}
      successMessage="Contract bytecode set successfully!"
    />
  );
}