import React from 'react'
import { z } from 'zod'
import { FancyCreateTitle } from './components/FancyCreateTitle.js'
import { type options } from './options.js'
import type { args } from './args.js'
import { useStore } from './state/Store.js'
import { Box } from 'ink'
import { InteractivePrompt } from './pages/InteractivePrompt.js'

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
  })

  return (
    <Box display="flex" flexDirection="column">
      <FancyCreateTitle />
      <InteractivePrompt defaultName={defaultName} store={store} />
    </Box>
  )
}

