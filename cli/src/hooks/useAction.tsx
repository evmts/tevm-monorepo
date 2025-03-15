import { useQuery } from '@tanstack/react-query'
import { createMemoryClient } from '@tevm/memory-client'
import { http } from '@tevm/jsonrpc'
import { openEditor } from '../utils/openEditor.js'
import JSONBig from 'json-bigint'
import React from 'react'

// Configure JSON BigInt for handling large numbers
const JSON_BIG = JSONBig({
  useNativeBigInt: true,     // Use native BigInt
  alwaysParseAsBig: true,    // Parse all numbers as BigInt for consistency
  protoAction: 'ignore',     // Security: ignore __proto__ properties
  constructorAction: 'ignore', // Security: ignore constructor properties
})

// Helper function to load options from environment variables
export const envVar = (name: string, prefix = 'TEVM_') => process.env[`${prefix}${name.toUpperCase()}`]

// Hook options type
export interface UseActionOptions<TParams, TResult> {
  // Action identification
  actionName: string

  // Options and defaults
  options: Record<string, any>
  defaultValues: Record<string, any>
  optionDescriptions: Record<string, string>

  // Action-specific function to execute
  executeAction: (client: any, params: TParams) => Promise<TResult>

  // Function to create params object from options
  createParams: (options: Record<string, any>) => TParams
}

/**
 * Hook for TEVM CLI actions with interactive parameter editing
 */
export function useAction<TParams, TResult>({
  actionName,
  options,
  defaultValues,
  optionDescriptions,
  executeAction,
  createParams,
}: UseActionOptions<TParams, TResult>) {
  // Apply environment variables as fallbacks for options that aren't set via CLI
  const baseOptions = React.useMemo(() => {
    // Start with the provided options
    const enhancedOptions = { ...options };

    // Add environment variable fallbacks for each option
    Object.keys(optionDescriptions).forEach(key => {
      const envKey = key.replace(/([A-Z])/g, '_$1').toLowerCase(); // Convert camelCase to snake_case for env vars
      enhancedOptions[key] = options[key] || envVar(envKey) || defaultValues[key] || undefined;
    });

    return enhancedOptions;
  }, [options, optionDescriptions, defaultValues]);

  // Interactive editor query
  const {
    data: interactiveParams,
    isLoading: isInteractiveLoading,
    error: interactiveError,
    isSuccess: isInteractiveSuccess
  } = useQuery({
    queryKey: [`interactive-editor-${actionName}`, JSON_BIG.stringify(baseOptions)],
    queryFn: async () => {
      try {
        // Create params with defaults applied
        const params = {};

        // Add all options to params object
        Object.entries(optionDescriptions).forEach(([key, _]) => {
          // Skip run and formatJson which are UI-specific
          if (key === 'run' || key === 'formatJson') return;

          // Get the value, using the base option, default value, or null
          const value = (baseOptions as any)[key] ?? defaultValues[key] ?? null;
          (params as any)[key] = value;
        });

        // Use JSON_BIG for the editor content
        const initialContent = JSON_BIG.stringify(params, null, 2);
        const editedContent = await openEditor(initialContent, '.js');
        return JSON_BIG.parse(editedContent);
      } catch (error) {
        console.error("Error in interactive editor:", error);
        throw new Error(`Failed to process parameters: ${error instanceof Error ? error.message : String(error)}`);
      }
    },
    enabled: options['run'] !== true,
    retry: false,
  })

  // Use either the interactive parameters or the base options
  const enhancedOptions = React.useMemo(() => {
    if (interactiveParams) {
      return {
        ...baseOptions,
        ...interactiveParams,
      }
    }
    return baseOptions
  }, [baseOptions, interactiveParams])

  // Action execution query - only runs after interactive mode completes (if enabled)
  const {
    isLoading: isActionLoading,
    error: actionError,
    data: result
  } = useQuery({
    queryKey: [actionName, JSON.parse(JSON_BIG.stringify(enhancedOptions))],
    queryFn: async () => {
      const client = createMemoryClient({
        fork: {transport: http(enhancedOptions.rpc || 'http://localhost:8545')},
      })

      // Create action params from the options
      const params = createParams(enhancedOptions);

      // Execute the action
      const result = await executeAction(client, params);

      return result
    },
    enabled: options['run'] === true || isInteractiveSuccess,
    retry: false,
  })

  return {
    // Results
    result,
    formattedResult: result ? JSON_BIG.stringify(result, null, 2) : undefined,

    // Loading states
    isInteractiveLoading,
    isActionLoading,

    // Errors
    interactiveError,
    actionError,

    // Options
    options: enhancedOptions,
  }
}