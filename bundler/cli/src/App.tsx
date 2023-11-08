import type { args } from './args.js'
import { FancyCreateTitle } from './components/FancyCreateTitle.js'
import { type options } from './options.js'
import { InteractivePrompt } from './pages/InteractivePrompt.js'
import type { Page } from './state/State.js'
import { useStore } from './state/Store.js'
import { Box, Text } from 'ink'
import React, { type ReactNode } from 'react'
import { z } from 'zod'

type Props = {
  options: z.infer<typeof options>
  args: z.infer<typeof args>
}


export const App: React.FC<Props> = ({ options, args: [defaultName] }) => {
  const store = useStore({
    ...options,
    name: defaultName,
    currentStep: 0,
    path: '.',
    nameInput: '',
    chainIdInput: '',
    walletConnectIdInput: '',
    currentPage: options.skipPrompts ? 'creating' : 'interactive'
  })

  const pages: Record<Page, ReactNode> = {
    interactive: <InteractivePrompt defaultName={defaultName} store={store} />,
    complete: <Text>Complete</Text>,
    creating: <Text>Creating</Text>
  }

  return (
    <Box display="flex" flexDirection="column">
      <FancyCreateTitle />
      {pages[store.currentPage]}
    </Box>
  )
}

