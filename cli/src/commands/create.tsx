import React from 'react'
import { Box } from 'ink'
import { z } from 'zod'
import { type options } from '../utils/create-options.js'
import { type args } from '../utils/create-args.js'
import { FancyCreateTitle } from '../components/FancyCreateTitle.js'
import { useStore } from '../state/Store.js'
import type { State } from '../state/State.js'
import { Creating } from '../components/Creating.js'
import { InteractivePrompt } from '../components/InteractivePrompt.js'

type Props = {
  options: z.infer<typeof options>
  args: z.infer<typeof args>
}

// Add command description for help output
export const description = "Create a new Ethereum account or smart contract";

export default function Create({ options, args: [defaultName] }: Props) {
  // Initialize store with default values
  React.useEffect(() => {
    useStore.setState({
      name: defaultName,
      currentStep: 0,
      path: '.',
      nameInput: '',
      framework: options.template,
      useCase: 'ui',
      packageManager: 'npm',
      noGit: false,
      noInstall: false,
      currentPage: options.skipPrompts ? 'creating' : 'interactive',
      walletConnectProjectId: '',
    } satisfies State)
  }, [defaultName, options.skipPrompts, options.template])

  const store = useStore()

  const pages = {
    interactive: <InteractivePrompt defaultName={defaultName} store={store} />,
    creating: <Creating store={store} />,
    complete: <Box>Complete!</Box>,
  }

  return (
    <Box display='flex' flexDirection='column'>
      <FancyCreateTitle key={store.currentPage} loading={store.currentPage === 'creating'} />
      {pages[store.currentPage]}
    </Box>
  )
}