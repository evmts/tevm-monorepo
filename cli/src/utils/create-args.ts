import { generateRandomName } from './generateRandomName.js'
import { z } from 'zod'
import { argument } from 'pastel'

// Helper function to load options from environment variables
const envVar = (name: string, prefix = 'TEVM_') => process.env[`${prefix}${name.toUpperCase()}`]

const defaultName = envVar('name') || generateRandomName()

export const args = z.tuple([
  z.string().optional().default(defaultName).describe(
    argument({
      name: 'name',
      description: 'The name of the application, as well as the name of the directory to create (env: TEVM_NAME)',
    })
  ),
])