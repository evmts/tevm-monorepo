import React from 'react'
import { Text, Box } from 'ink'
import Spinner from 'ink-spinner'

export interface CliActionProps {
  // Results
  result?: any
  formattedResult?: string

  // Loading states
  isInteractiveLoading?: boolean
  isActionLoading?: boolean

  // Errors
  interactiveError?: Error | null
  actionError?: Error | null

  // Options and context
  options?: Record<string, any>
  actionName?: string
  targetName?: string // Name of the target (address, contract, etc.)
  successMessage?: string
}

export default function CliAction({
  formattedResult,
  isInteractiveLoading,
  isActionLoading,
  interactiveError,
  actionError,
  targetName,
  successMessage = 'Action executed successfully!',
}: CliActionProps) {
  // Show loading state for interactive mode
  if (isInteractiveLoading) {
    return (
      <Box>
        <Text>Opening parameters in your editor...</Text>
      </Box>
    )
  }

  // Show interactive mode errors
  if (interactiveError) {
    return (
      <Box>
        <Text color="red">Error: {(interactiveError as Error).message || 'Failed to process edited parameters'}</Text>
      </Box>
    )
  }

  // Show loading state for action
  if (isActionLoading) {
    return (
      <Box>
        <Text>
          <Spinner type="dots" /> {targetName ? `Processing ${targetName}...` : 'Executing...'}
        </Text>
      </Box>
    )
  }

  // Show action errors
  if (actionError) {
    console.error(actionError)
    return (
      <Box>
        <Text color="red">Error: {(actionError as Error).message || 'Unknown error occurred'}</Text>
      </Box>
    )
  }

  return (
    <Box flexDirection="column">
      <Text>{successMessage}</Text>
      {formattedResult && <Text>{formattedResult}</Text>}
    </Box>
  )
}