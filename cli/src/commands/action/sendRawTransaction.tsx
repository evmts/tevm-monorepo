import { z } from 'zod'
import { option } from 'pastel'
import { useAction } from '../../hooks/useAction.js'
import CliAction from '../../components/CliAction.js'

// Add command description for help output
export const description = "Send a signed raw transaction to the blockchain";

// Options definitions and descriptions
const optionDescriptions = {
  serializedTransaction: 'The signed serialized transaction (env: TEVM_SERIALIZED_TRANSACTION)',
  rpc: 'RPC endpoint (env: TEVM_RPC)',
}

// Empty args tuple
export const args = z.tuple([])

export const options = z.object({
  // ALL PARAMETERS OPTIONAL
  serializedTransaction: z.string().optional().describe(
    option({
      description: optionDescriptions.serializedTransaction,
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
  serializedTransaction: '0x02f850018203118080825208808080c080a04012522854168b27e5dc3d5839bab5e6b39e1a0ffd343901ce1622e3d64b48f1a04e00902ae0502c4728cbf12156290df99c3ed7de85b1dbfe20b5c36931733a33',
  rpc: 'http://localhost:8545',
}

export default function SendRawTransaction({ options }: Props) {
  // Use the action hook
  const actionResult = useAction({
    actionName: 'sendRawTransaction',
    options,
    defaultValues,
    optionDescriptions,

    // Create params
    createParams: (enhancedOptions: Record<string, any>) => {
      return {
        serializedTransaction: enhancedOptions['serializedTransaction'] || defaultValues['serializedTransaction'],
      };
    },

    // Execute the action
    executeAction: async (client: any, params: any): Promise<any> => {
      return await client.sendRawTransaction(params);
    },
  });

  // If editor is active, render nothing
  if (actionResult.editorActive) {
    return null;
  }

  return (
    <CliAction
      {...actionResult}
      targetName="serialized transaction"
      successMessage="Transaction sent successfully!"
    />
  );
}