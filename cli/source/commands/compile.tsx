import React from 'react';
import {Text} from 'ink';
import zod from 'zod';
import {option} from 'pastel';

export const options = zod.object({
  watch: zod.boolean().describe(
    option({
      description: 'Watch for changes',
      alias: 'w',
    })
  ),
  optimize: zod.boolean().default(true).describe(
    option({
      description: 'Enable optimizations',
      defaultValueDescription: 'true',
    })
  ),
  target: zod.enum(['es2015', 'es2020', 'esnext']).default('es2020').describe(
    option({
      description: 'Compilation target',
      defaultValueDescription: 'es2020',
    })
  ),
});

type Props = {
  options: zod.infer<typeof options>;
};

export default function Compile({options}: Props) {
  return (
    <Text>
      Compiling with target={options.target}, optimize={String(options.optimize)}, watch={String(options.watch)}
    </Text>
  );
} 