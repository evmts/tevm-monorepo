import React from 'react'
import { Box } from 'ink'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { z } from 'zod'
import { option, argument } from 'pastel'
import { FancyCreateTitle } from '../components/FancyCreateTitle.js'
import { useStore } from '../state/Store.js'
import { generateRandomName } from '../utils/generateRandomName.js'

const defaultName = generateRandomName()

export const args = z.tuple([
  z.string().optional().default(defaultName).describe(
    argument({
      name: 'name',
      description: 'The name of the application, as well as the name of the directory to create',
    })
  ),
])

export const options = z.object({
  skipPrompts: z.boolean().default(false).describe(
    option({
      description: 'Bypass interactive CLI prompt and use only command line flag options',
    })
  ),
  template: z.enum(['hardhat', 'foundry']).default('hardhat').describe(
    option({
      description: 'Project template to use',
      defaultValueDescription: 'hardhat',
    })
  ),
})

type Props = {
  args: z.infer<typeof args>
  options: z.infer<typeof options>
}

const queryClient = new QueryClient()

export default function Create({ options, args: [defaultName] }: Props) {
  const store = useStore({
    ...options,
    name: defaultName,
    currentStep: 0,
    path: '.',
    nameInput: '',
    currentPage: options.skipPrompts ? 'creating' : 'interactive',
  })

  return (
    <QueryClientProvider client={queryClient}>
      <Box display='flex' flexDirection='column'>
        <FancyCreateTitle key={store.currentPage} loading={store.currentPage === 'creating'} />
        {store.currentPage === 'interactive' && (
          <Box>Interactive prompts coming soon...</Box>
        )}
        {store.currentPage === 'creating' && (
          <Box>Creating project...</Box>
        )}
        {store.currentPage === 'complete' && (
          <Box>Complete!</Box>
        )}
      </Box>
    </QueryClientProvider>
  )
} 