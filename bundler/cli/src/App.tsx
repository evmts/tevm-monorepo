import { Creating } from './Creating.js'
import { InteractivePrompt } from './InteractivePrompt.js'
import type { args } from './args.js'
import { FancyCreateTitle } from './components/FancyCreateTitle.js'
import { type options } from './options.js'
import type { Page } from './state/State.js'
import { useStore } from './state/Store.js'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Box, Text } from 'ink'
import React, { type ReactNode } from 'react'
import { z } from 'zod'

type Props = {
	options: z.infer<typeof options>
	args: z.infer<typeof args>
}

const queryClient = new QueryClient()

export const App: React.FC<Props> = ({ options, args: [defaultName] }) => {
	const store = useStore({
		...options,
		name: defaultName,
		currentStep: 0,
		path: '.',
		nameInput: '',
		walletConnectIdInput: '',
		currentPage: options.skipPrompts ? 'creating' : 'interactive',
	})

	const pages: Record<Page, ReactNode> = {
		interactive: <InteractivePrompt defaultName={defaultName} store={store} />,
		complete: <Text>Complete</Text>,
		creating: <Creating store={store} />,
	}

	return (
		<QueryClientProvider client={queryClient}>
			<Box display='flex' flexDirection='column'>
				<FancyCreateTitle
					key={store.currentPage}
					loading={store.currentPage === 'creating'}
				/>
				{pages[store.currentPage]}
			</Box>
		</QueryClientProvider>
	)
}
