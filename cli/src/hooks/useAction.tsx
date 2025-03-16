/**
 * Hook for executing Tevm actions with interactive capabilities
 */
import { useQuery } from '@tanstack/react-query'
import { createMemoryClient } from '@tevm/memory-client'
import { http } from '@tevm/jsonrpc'
import JSONBig from 'json-bigint'
import React from 'react'
import { 
  createEditorProject, 
  openEditor, 
  waitForDependencies, 
  executeTsFile, 
  cleanupProject 
} from '../utils/editor.js'
import { isViemAction, loadViemClient } from '../utils/clients.js'

// Configure JSON BigInt for handling large numbers
const JSON_BIG = JSONBig({
  useNativeBigInt: true,     // Use native BigInt
  alwaysParseAsBig: true,    // Parse all numbers as BigInt for consistency
  protoAction: 'ignore',     // Security: ignore __proto__ properties
  constructorAction: 'ignore', // Security: ignore constructor properties
})

/**
 * Helper function to load options from environment variables
 * @param {string} name - The name of the environment variable (without prefix)
 * @param {string} prefix - The prefix to use (default: TEVM_)
 * @returns {string|undefined} - The value from the environment variable or undefined if not set
 */
export const envVar = (name: string, prefix = 'TEVM_'): string | undefined => 
  process.env[`${prefix}${name.toUpperCase()}`]

/**
 * Options for the useAction hook
 */
export interface UseActionOptions<TParams, TResult> {
  /** Action name to execute */
  actionName: string

  /** Options passed from the command line */
  options: Record<string, any>
  
  /** Default values for unspecified options */
  defaultValues: Record<string, any>
  
  /** Descriptions for each option (used for help text) */
  optionDescriptions: Record<string, string>

  /** Function to create action parameters from options */
  createParams: (options: Record<string, any>) => TParams
  
  /** Function to execute the action using the client */
  executeAction: (client: any, params: TParams) => Promise<TResult>
}

/**
 * Hook for TEVM CLI actions with interactive parameter editing
 * 
 * This hook provides two execution paths:
 * 1. Interactive - Opens an editor for the user to modify parameters
 * 2. Direct - Executes the action with the provided parameters
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

  // Use refs to track state that shouldn't trigger re-renders
  const editorOpenedRef = React.useRef(false);
  const editorInProgressRef = React.useRef(false);
  const projectDirRef = React.useRef<string | null>(null);

  // Track if we're in the editor session - used to prevent rendering UI during editing
  const [editorActive, setEditorActive] = React.useState(false);

  // Interactive editor query - only runs when run flag is false
  const {
    data: interactiveResult,
    isLoading: isInteractiveLoading,
    error: interactiveError,
  } = useQuery({
    queryKey: [`interactive-editor-${actionName}`, JSON_BIG.stringify(baseOptions)],
    queryFn: async () => {
      try {
        // Don't run again if we've already opened the editor
        if (editorOpenedRef.current) {
          return projectDirRef.current ?
            await executeTsFile(projectDirRef.current) :
            null;
        }

        // Set editor opened ref immediately to prevent reruns
        editorOpenedRef.current = true;

        // Create the TypeScript project
        const projectDir = await createEditorProject(
          actionName,
          baseOptions,
          createParams
        );

        // Store the project directory for cleanup and reuse
        projectDirRef.current = projectDir;

        // THIS IS CRITICAL: Set the editor active flag before opening the editor
        // to prevent any React UI rendering during the editor session
        setEditorActive(true);
        editorInProgressRef.current = true;

        // Open the editor and wait for it to close
        await openEditor(projectDir);

        // Editor is now closed
        editorInProgressRef.current = false;
        setEditorActive(false);

        // Wait for dependencies to be installed
        await waitForDependencies(projectDir);

        // Execute the edited file
        return await executeTsFile(projectDir);
      } catch (error) {
        // Make sure we reset the editor state on error
        editorInProgressRef.current = false;
        setEditorActive(false);
        console.error("Error in interactive editor:", error);
        throw error;
      }
    },
    enabled: options['run'] !== true,
    retry: false,
  });

  // Direct action execution query - only runs when run flag is true
  const {
    isLoading: isActionLoading,
    error: actionError,
    data: result
  } = useQuery({
    queryKey: [actionName, JSON_BIG.stringify(baseOptions)],
    queryFn: async () => {
      let client;

      // Create the appropriate client based on action type
      if (isViemAction(actionName)) {
        client = await loadViemClient(baseOptions['rpc'] || 'http://localhost:8545');
        if (!client) {
          throw new Error('Failed to create Viem client');
        }
      } else {
        client = createMemoryClient({
          fork: {transport: http(baseOptions['rpc'] || 'http://localhost:8545')}
        });
      }

      // Create the parameters and execute the action
      const params = createParams(baseOptions);
      return await executeAction(client, params);
    },
    enabled: options['run'] === true,
    retry: false,
  });

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (projectDirRef.current) {
        cleanupProject(projectDirRef.current);
      }
    };
  }, []);

  // Determine the final result based on either interactive or direct execution
  const finalResult = interactiveResult || result;

  // If editor is active, return an object indicating not to render anything
  if (editorActive || editorInProgressRef.current) {
    return {
      result: null,
      formattedResult: undefined,
      isInteractiveLoading: false,
      isActionLoading: false,
      isInstallingDeps: false,
      interactiveError: null,
      actionError: null,
      options: baseOptions,
      editorActive: true
    };
  }

  return {
    // Results
    result: finalResult,
    formattedResult: finalResult ? JSON.stringify(finalResult, null, 2) : undefined,

    // Loading states
    isInteractiveLoading: isInteractiveLoading && !editorActive,
    isActionLoading,
    isInstallingDeps: isInteractiveLoading && !editorActive,

    // Errors
    interactiveError: interactiveError as Error | null,
    actionError: actionError as Error | null,

    // Options
    options: baseOptions,
    editorActive: false
  };
}