import React from 'react'
import { z } from 'zod'
import { option } from 'pastel'
import { useAction } from '../../hooks/useAction.js'
import CliAction from '../../components/CliAction.js'

// Add command description for help output
export const description = "Simulate multiple contract calls without committing them to the blockchain";

// Options definitions and descriptions
const optionDescriptions = {
  account: 'Account to simulate calls from (env: TEVM_ACCOUNT)',
  blockNumber: 'Block number to simulate at (env: TEVM_BLOCK_NUMBER)',
  blockTag: 'Block tag (latest, pending, etc.) to simulate at (env: TEVM_BLOCK_TAG)',
  calls: 'Array of calls to simulate (edited interactively) (env: TEVM_CALLS)',
  traceAssetChanges: 'Whether to trace asset changes (env: TEVM_TRACE_ASSET_CHANGES)',
  traceTransfers: 'Whether to trace transfers (env: TEVM_TRACE_TRANSFERS)',
  validation: 'Whether to enable validation mode (env: TEVM_VALIDATION)',
  rpc: 'RPC endpoint (env: TEVM_RPC)',
}

// Define a fallback ERC20 ABI
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

// Empty args tuple
export const args = z.tuple([])

export const options = z.object({
  // ALL PARAMETERS OPTIONAL
  account: z.string().optional().describe(
    option({
      description: optionDescriptions.account,
    })
  ),

  blockNumber: z.string().optional().describe(
    option({
      description: optionDescriptions.blockNumber,
    })
  ),

  blockTag: z.string().optional().describe(
    option({
      description: optionDescriptions.blockTag,
    })
  ),

  traceAssetChanges: z.boolean().optional().describe(
    option({
      description: optionDescriptions.traceAssetChanges,
    })
  ),

  traceTransfers: z.boolean().optional().describe(
    option({
      description: optionDescriptions.traceTransfers,
    })
  ),

  validation: z.boolean().optional().describe(
    option({
      description: optionDescriptions.validation,
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
  account: '0x5a0b54d5dc17e482fe8b0bdca5320161b95fb929',
  blockTag: 'latest',
  calls: [
    {
      to: '0xcb98643b8786950F0461f3B0edf99D88F274574D',
      value: '1000000000000000000', // 1 ETH
    },
    {
      to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
      data: '0xdeadbeef',
    }
  ],
  traceAssetChanges: true,
  traceTransfers: false,
  validation: false,
  rpc: 'http://localhost:8545',
}

// Helper function to parse call values
const parseCallValues = (calls: any[]): any[] => {
  return calls.map(call => {
    const parsedCall = { ...call };

    // Convert value to bigint if present
    if (parsedCall.value !== undefined && typeof parsedCall.value === 'string') {
      try {
        parsedCall.value = BigInt(parsedCall.value);
      } catch (e) {
        console.warn(`Could not convert call value "${parsedCall.value}" to BigInt`);
      }
    }

    return parsedCall;
  });
};

export default function SimulateCalls({ options }: Props) {
  // Use the action hook
  const actionResult = useAction({
    actionName: 'simulateCalls',
    options,
    defaultValues,
    optionDescriptions,

    // Create params
    createParams: async (enhancedOptions: Record<string, any>) => {
      const params: Record<string, any> = {};

      // Account
      if (enhancedOptions['account']) {
        params['account'] = enhancedOptions['account'];
      }

      // Block identifier - only one should be used
      if (enhancedOptions['blockNumber']) {
        try {
          params['blockNumber'] = BigInt(enhancedOptions['blockNumber']);
        } catch (e) {
          console.warn(`Could not convert "${enhancedOptions['blockNumber']}" to BigInt`);
        }
      } else if (enhancedOptions['blockTag']) {
        params['blockTag'] = enhancedOptions['blockTag'];
      }

      // Attempt to get ERC20 ABI for any calls that need it
      let abi;
      try {
        // Instead of trying to import a package that doesn't exist,
        // just use the fallback ABI directly
        abi = fallbackERC20Abi;
      } catch (e) {
        console.warn('Failed to load ERC20 ABI, using fallback');
        abi = fallbackERC20Abi;
      }

      // Process calls array to ensure each contract call has an ABI if needed
      const calls = Array.isArray(enhancedOptions['calls'])
        ? enhancedOptions['calls']
        : defaultValues['calls'];

      const processedCalls = calls.map((call: Record<string, any>) => {
        // If it has functionName but no ABI, add the default ABI
        if (call['functionName'] && !call['abi']) {
          return { ...call, abi };
        }
        return call;
      });

      // Add calls to params
      params['calls'] = parseCallValues(processedCalls);

      // Optional boolean flags
      if (enhancedOptions['traceAssetChanges'] !== undefined) {
        params['traceAssetChanges'] = enhancedOptions['traceAssetChanges'];
      }

      if (enhancedOptions['traceTransfers'] !== undefined) {
        params['traceTransfers'] = enhancedOptions['traceTransfers'];
      }

      if (enhancedOptions['validation'] !== undefined) {
        params['validation'] = enhancedOptions['validation'];
      }

      return params;
    },

    // Execute the action
    executeAction: async (client: any, params: any): Promise<any> => {
      // Check if client supports this method
      if (!client.simulateCalls) {
        throw new Error('simulateCalls action is not available on this client. Make sure you are using a compatible client.');
      }
      return await client.simulateCalls(params);
    },
  });

  // If editor is active, render nothing
  if (actionResult.editorActive) {
    return null;
  }

  return (
    <CliAction
      {...actionResult}
      targetName={`${(actionResult.options['calls'] || []).length} calls`}
      successMessage="Calls simulated successfully!"
    />
  );
}