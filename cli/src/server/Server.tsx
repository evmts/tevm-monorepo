import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Box } from 'ink'
import React, { useMemo } from 'react'
import { z } from 'zod'
import { StartServer } from './StartServer.js'
import { options as optionsSchema } from './options.js'

type ServerProps = {
	options: z.infer<typeof optionsSchema>
}

const queryClient = new QueryClient()

export const Server: React.FC<ServerProps> = ({ options }) => {
	const parsedOptions = useMemo(() => {
		return optionsSchema.safeParse(options)
	}, [options])
	if (parsedOptions.success === false) {
		return (
			<Box display="flex" flexDirection="column" padding={1}>
				Invalid options ${parsedOptions.error.message}
			</Box>
		)
	}
	return (
		<QueryClientProvider client={queryClient}>
			<Box display="flex" flexDirection="column" padding={1}>
				<StartServer options={parsedOptions.data} />
			</Box>
		</QueryClientProvider>
	)
}
