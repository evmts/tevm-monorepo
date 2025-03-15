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
  isInstallingDeps?: boolean

  // Errors
  interactiveError?: Error | null
  actionError?: Error | null

  // Options and context
  options?: Record<string, any>
  actionName?: string
  targetName?: string // Name of the target (address, contract, etc.)
  successMessage?: string

  // Editor state
  editorActive?: boolean // Add this new flag
}

export default function CliAction({
  formattedResult,
  isInteractiveLoading,
  isActionLoading,
  isInstallingDeps,
  interactiveError,
  actionError,
  targetName,
  successMessage = 'Action executed successfully!',
  editorActive = false, // Check for this flag
}: CliActionProps) {
  // If editor is active, render absolutely nothing
  if (editorActive) {
    return null;
  }

  // Regular rendering logic continues...
  // Show loading state for interactive mode
  if (isInteractiveLoading) {
    return (
      <Box>
        <Text>Opening parameters in your editor...</Text>
        {isInstallingDeps && (
          <Box marginTop={1}>
            <Text>
              <Spinner type="dots" /> Installing dependencies in the background...
            </Text>
          </Box>
        )}
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
      <Box flexDirection="column">
        <Text>
          <Spinner type="dots" /> {targetName ? `Processing ${targetName}...` : 'Executing...'}
        </Text>
        {isInstallingDeps && (
          <Box marginTop={1}>
            <Text>
              <Spinner type="dots" /> Installing dependencies...
            </Text>
          </Box>
        )}
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