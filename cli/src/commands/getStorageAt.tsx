import React from 'react'
import { z } from 'zod'
import { option } from 'pastel'
import { useAction } from '../hooks/useAction.js'
import CliAction from '../components/CliAction.js'

// Options definitions and descriptions
const optionDescriptions = {
  address: 'Contract address to get storage from (env: TEVM_ADDRESS)',
  slot: 'Storage slot to read (env: TEVM_SLOT)',
  blockTag: 'Block tag (latest, pending, etc.) (env: TEVM_BLOCK_TAG)',
  blockNumber: 'Block number to get storage at (env: TEVM_BLOCK_NUMBER)',
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

  slot: z.string().optional().describe(
    option({
      description: optionDescriptions.slot,
    })
  ),

  blockTag: z.string().optional().describe(
    option({
      description: optionDescriptions.blockTag,
    })
  ),

  blockNumber: z.string().optional().describe(
    option({
      description: optionDescriptions.blockNumber,
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
  slot: '0x0',
  blockTag: 'latest',
  rpc: 'http://localhost:8545',
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

export default function GetStorageAt({ options }: Props) {
  // Use the action hook
  const actionResult = useAction({
    actionName: 'getStorageAt',
    options,
    defaultValues,
    optionDescriptions,

    // Create params
    createParams: (enhancedOptions: Record<string, any>) => {
      const params: Record<string, any> = {
        address: enhancedOptions['address'] || defaultValues['address'],
        slot: enhancedOptions['slot'] || defaultValues['slot'],
      };

      // Add block identifier - only one should be used
      if (enhancedOptions['blockNumber']) {
        params['blockNumber'] = parseBlockNumber(enhancedOptions['blockNumber']);
      } else if (enhancedOptions['blockTag']) {
        params['blockTag'] = enhancedOptions['blockTag'];
      }

      return params;
    },

    // Execute the action
    executeAction: async (client: any, params: any): Promise<any> => {
      return await client.getStorageAt(params);
    },
  });

  // If editor is active, render nothing
  if (actionResult.editorActive) {
    return null;
  }

  return (
    <CliAction
      {...actionResult}
      targetName={`storage slot ${actionResult.options['slot'] || '0x0'} at ${actionResult.options['address'] || '0x0000...0000'}`}
      successMessage="Storage value retrieved successfully!"
    />
  );
}