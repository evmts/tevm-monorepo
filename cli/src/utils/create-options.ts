import { z } from 'zod'
import { option } from 'pastel'

// Helper function to load options from environment variables
const envVar = (name: string, prefix = 'TEVM_') => process.env[`${prefix}${name.toUpperCase()}`]

export const options = z.object({
  skipPrompts: z.boolean().default(envVar('skip_prompts') === 'true' || false).describe(
    option({
      description: 'Bypass interactive CLI prompt and use only command line flag options (env: TEVM_SKIP_PROMPTS)',
    })
  ),
  template: z.enum(['hardhat', 'foundry']).default(
    (envVar('template') as 'hardhat' | 'foundry' | undefined) || 'hardhat'
  ).describe(
    option({
      description: 'Project template to use (env: TEVM_TEMPLATE)',
      defaultValueDescription: 'hardhat',
    })
  )
})