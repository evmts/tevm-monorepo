import React from 'react';
import {Text} from 'ink';
import zod from 'zod';
import {option, argument} from 'pastel';

export const args = zod.tuple([
  zod.enum(['contract', 'test', 'script']).describe(
    argument({
      name: 'type',
      description: 'Type of file to generate',
    })
  ),
  zod.string().describe(
    argument({
      name: 'name',
      description: 'Name of the file',
    })
  ),
]);

export const options = zod.object({
  force: zod.boolean().describe(
    option({
      description: 'Overwrite existing files',
      alias: 'f',
    })
  ),
});

type Props = {
  args: zod.infer<typeof args>;
  options: zod.infer<typeof options>;
};

export default function Generate({args, options}: Props) {
  const [type, name] = args;
  return (
    <Text>
      Generating {type} "{name}"{options.force ? ' (force)' : ''}
    </Text>
  );
} 