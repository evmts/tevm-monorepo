import { Box, Text, useApp } from 'ink'
import Spinner from 'ink-spinner'
import { useEffect } from 'react'

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
	editorActive?: boolean
}

export default function CliAction({
	formattedResult,
	isInteractiveLoading,
	isActionLoading,
	isInstallingDeps,
	interactiveError,
	actionError,
	targetName,
	editorActive = false,
}: CliActionProps) {
	const { exit } = useApp()
	const error = interactiveError || actionError

	useEffect(() => {
		if (!error) {
			return
		}

		process.exitCode = 1
		const timeout = setTimeout(() => exit(error), 0)
		return () => clearTimeout(timeout)
	}, [error, exit])

	// If editor is active, render absolutely nothing
	if (editorActive) {
		return null
	}

	// Priority 1: Show dependency installation
	if (isInstallingDeps) {
		return (
			<Box>
				<Text>
					<Spinner type="dots" /> Installing dependencies...
				</Text>
			</Box>
		)
	}

	// Priority 2: Show loading state
	if (isInteractiveLoading || isActionLoading) {
		return (
			<Box>
				<Text>
					<Spinner type="dots" /> {isActionLoading && targetName ? `Processing ${targetName}...` : 'Processing...'}
				</Text>
			</Box>
		)
	}

	// Priority 3: Show errors if present
	if (error) {
		return (
			<Box>
				<Text color="red">{(error as Error).message || 'An error occurred'}</Text>
			</Box>
		)
	}

	// Priority 4: Show just the result
	if (formattedResult) {
		return (
			<Box>
				<Text>{formattedResult}</Text>
			</Box>
		)
	}

	// Fallback (should rarely happen)
	return null
}
