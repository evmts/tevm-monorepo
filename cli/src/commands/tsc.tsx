import { Text } from 'ink'
import { option } from 'pastel'
import zod from 'zod'

// Add command description for help output
export const description = "Compile TypeScript files with TEVM's TypeScript plugin"

export const options = zod.object({
	watch: zod.boolean().describe(
		option({
			description: 'Watch for changes',
			alias: 'w',
		}),
	),
	project: zod
		.string()
		.optional()
		.describe(
			option({
				description: 'Path to tsconfig.json',
			}),
		),
	noEmit: zod.boolean().describe(
		option({
			description: 'Do not emit outputs',
			alias: 'n',
		}),
	),
})

type Props = {
	options: zod.infer<typeof options>
}

export default function Tsc({ options }: Props) {
	return (
		<Text>
			Running TypeScript compiler
			{options.project ? ` with config ${options.project}` : ''}
			{options.watch ? ' in watch mode' : ''}
			{options.noEmit ? ' (no emit)' : ''}
		</Text>
	)
}
