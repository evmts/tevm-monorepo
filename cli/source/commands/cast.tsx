import React from 'react';
import {Text} from 'ink';
import zod from 'zod';
import {option, argument} from 'pastel';

export const args = zod.tuple([
  zod.enum(['call', 'send', 'estimate']).describe(
    argument({
      name: 'action',
      description: 'Action to perform',
    })
  ),
  zod.string().describe(
    argument({
      name: 'address',
      description: 'Contract address',
    })
  ),
]);

export const options = zod.object({
  rpc: zod.string().default('http://localhost:8545').describe(
    option({
      description: 'RPC endpoint',
      defaultValueDescription: 'http://localhost:8545',
    })
  ),
  value: zod.string().optional().describe(
    option({
      description: 'ETH value to send',
    })
  ),
  data: zod.string().optional().describe(
    option({
      description: 'Transaction data',
    })
  ),
});

type Props = {
  args: zod.infer<typeof args>;
  options: zod.infer<typeof options>;
};

export default function Cast({args, options}: Props) {
  const [action, address] = args;
  return (
    <Text>
      {action} to {address} via {options.rpc}
      {options.value ? ` with ${options.value} ETH` : ''}
      {options.data ? ` and data: ${options.data}` : ''}
    </Text>
  );
} 