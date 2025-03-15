import React from 'react';
import {Text} from 'ink';
import zod from 'zod';
import {option} from 'pastel';

export const options = zod.object({
  port: zod.number().default(8545).describe(
    option({
      description: 'Port to listen on',
      defaultValueDescription: '8545',
    })
  ),
  host: zod.string().default('localhost').describe(
    option({
      description: 'Host to bind to',
      defaultValueDescription: 'localhost',
    })
  ),
  fork: zod.string().optional().describe(
    option({
      description: 'URL of network to fork',
    })
  ),
});

type Props = {
  options: zod.infer<typeof options>;
};

export default function Serve({options}: Props) {
  return (
    <Text>
      Starting server on {options.host}:{options.port}
      {options.fork ? ` (forking ${options.fork})` : ''}
    </Text>
  );
} 