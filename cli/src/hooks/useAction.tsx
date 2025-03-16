import { useQuery } from '@tanstack/react-query'
import { createMemoryClient } from '@tevm/memory-client'
import { http } from '@tevm/jsonrpc'
import JSONBig from 'json-bigint'
import React from 'react'
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { spawn } from 'node:child_process'

// Configure JSON BigInt for handling large numbers
const JSON_BIG = JSONBig({
  useNativeBigInt: true,     // Use native BigInt
  alwaysParseAsBig: true,    // Parse all numbers as BigInt for consistency
  protoAction: 'ignore',     // Security: ignore __proto__ properties
  constructorAction: 'ignore', // Security: ignore constructor properties
})

// Helper function to load options from environment variables
export const envVar = (name: string, prefix = 'TEVM_') => process.env[`${prefix}${name.toUpperCase()}`]

// Helper to determine if an action is a Viem action
function isViemAction(actionName: string): boolean {
  const viemActions = [
    'readContract', 'estimateGas', 'getBalance', 'getBlock',
    'getBlockNumber', 'getChainId', 'getGasPrice', 'getTransaction',
    'getTransactionCount', 'getTransactionReceipt', 'sendTransaction'
  ];
  return viemActions.includes(actionName);
}

// Create a TypeScript project for interactive editing
async function createTsProject(
  actionName: string,
  options: Record<string, any>,
  _createParams: (options: Record<string, any>) => any,
): Promise<{ projectDir: string, scriptPath: string }> {
  // Convert options to a formatted params object
  const paramsObj = {};

  // Add all relevant options to params object
  Object.entries(options).forEach(([key, value]) => {
    // Skip run and formatJson which are UI-specific
    if (key === 'run' || key === 'formatJson' || key === 'rpc') return;

    (paramsObj as any)[key] = value;
  });

  // Handle args properly
  const paramsStr = Object.entries(paramsObj)
    .map(([key, value]) => {
      if (value === undefined) return null;

      // Handle different value types appropriately
      if (typeof value === 'bigint') {
        return `    ${key}: BigInt("${value.toString()}")`;
      } else if (key === 'abi') {
        // Skip abi in params string - we'll handle it specially
        return null;
      } else if (key === 'args') {
        return `    ${key}: ${parseArgsForTemplate(value)}`;
      } else if (typeof value === 'string') {
        return `    ${key}: "${value.replace(/"/g, '\\"')}"`;  // Escape quotes in strings
      } else if (typeof value === 'boolean' || typeof value === 'number') {
        return `    ${key}: ${value}`;
      }

      return null;
    })
    .filter(Boolean as any) // Type assertion to avoid filter callback issues
    .join(',\n');

  // Handle ABI parameter specially for readContract and other contract actions
  let abiParam = '';

  // Determine if this action needs an ABI (like readContract, multicall)
  const needsAbi = actionName === 'readContract' ||
                  actionName === 'multicall' ||
                  actionName === 'simulateCalls';

  // Determine if we need to import ERC20
  const needsERC20 = needsAbi && (!options['abi'] || options['abi'] === '');

  if (options['abi']) {
    try {
      const parsedAbi = JSON.parse(options['abi']);
      abiParam = `    abi: ${JSON.stringify(parsedAbi)},\n`;
    } catch (e) {
      // If parsing fails, we'll use ERC20.abi if we're importing it
      if (needsERC20) {
        abiParam = '    abi: ERC20.abi,\n';
      }
    }
  } else if (needsERC20) {
    // If no ABI provided but we need one, use ERC20.abi
    abiParam = '    abi: ERC20.abi,\n';
  }

  // Add onStep handler for the tevmCall action
  let onStepHandler = '';
  if (actionName === 'call' || actionName === 'tevmCall') {
    onStepHandler = `
    // Uncomment this onStep handler to inspect EVM execution step by step
    // onStep: (data, next) => {
    //   console.log(data.opcode.name); // Log the current opcode name
    //   next?.(); // Continue to the next step
    // },`;
  }

  // Determine if this is a TEVM-specific action or a Viem action
  const isViem = isViemAction(actionName);

  // Create the proper function call based on action type
  let functionCall;
  if (isViem) {
    // For Viem actions, use the native method name
    // If this is a contract-related action but without explicit ABI, make sure to include ERC20.abi
    if (needsAbi && needsERC20 && !abiParam) {
      functionCall = `${actionName}({
    abi: ERC20.abi,
${paramsStr}
})`;
    } else {
      functionCall = `${actionName}({
${abiParam}${paramsStr}
})`;
    }
  } else {
    // For TEVM actions, prefix with 'tevm'
    if (needsAbi && needsERC20 && !abiParam) {
      functionCall = `${actionName}({
    abi: ERC20.abi,
${paramsStr}${onStepHandler}
})`;
    } else {
      functionCall = `${actionName}({
${abiParam}${paramsStr}${onStepHandler}
})`;
    }
  }

  // Create the proper template based on action type
  let scriptTemplate;

  if (isViem) {
    // For Viem actions, use createPublicClient with direct http transport
    let formattedViemParams = functionCall;

    // Add special handling for numeric fields in Viem calls
    formattedViemParams = formattedViemParams.replace(/"(value|gas|gasPrice|maxFeePerGas|maxPriorityFeePerGas)": "(\d+)"/g,
      '"$1": BigInt("$2")');

    scriptTemplate = `import { createPublicClient, http } from 'viem'
${needsERC20 ? "import { ERC20 } from '@tevm/contract'" : ""}

const client = createPublicClient({
  transport: http('${options['rpc'] || 'http://localhost:8545'}')
})

client.${formattedViemParams}
  .then(console.log)
  .catch(console.error)
`;
  } else {
    // For TEVM actions, use the TEVM memory client
    scriptTemplate = `import { createMemoryClient } from '@tevm/memory-client'
import { http } from '@tevm/jsonrpc'
${needsERC20 ? "import { ERC20 } from '@tevm/contract'" : ""}

const client = createMemoryClient({
  fork: {transport: http('${options['rpc'] || 'http://localhost:8545'}')}
})

client.${functionCall}
  .then(console.log)
  .catch(console.error)
`;
  }

  // Create the plugins.ts file for Bun
  const pluginsTemplate = `import { bunPluginTevm } from '@tevm/bun-plugin'
import { plugin } from 'bun'

// Load Tevm plugin to enable solidity imports
// Tevm is configured in the tsconfig.json
plugin(bunPluginTevm({}))
`;

  // Create the bunfig.toml configuration
  const bunfigTemplate = `# Load plugin including Tevm plugin
# Tevm is configured in the tsconfig.json
preload = ["./plugins.ts"]

# Use plugin in tests too
[test]
preload = ["./plugins.ts"]
`;

  // Create the tsconfig.json configuration
  const tsconfigTemplate = `{
  "compilerOptions": {
    "plugins": [
      {
        "name": "@tevm/ts-plugin"
      }
    ],
    "target": "es6",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "types": ["bun-types"]
  },
  "include": ["**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
`;

  // Update package.json to include TypeScript plugins
  const packageJson = `{
  "name": "tevm-${actionName}-script",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "dependencies": {
    "tevm": "latest",
    "viem": "latest"
  },
  "devDependencies": {
    "@tevm/ts-plugin": "latest",
    "@tevm/bun-plugin": "latest",
    "typescript": "latest",
    "bun-types": "latest"
  }
}`;

  // Create a temporary directory
  const tmpDir = os.tmpdir();
  const projectDir = path.join(tmpDir, `tevm-${actionName}-${Date.now()}`);
  fs.mkdirSync(projectDir, { recursive: true });

  // Create package.json
  const packageJsonPath = path.join(projectDir, 'package.json');
  fs.writeFileSync(packageJsonPath, packageJson, 'utf8');

  // Create script.ts
  const scriptPath = path.join(projectDir, 'script.ts');
  fs.writeFileSync(scriptPath, scriptTemplate, 'utf8');

  // Create plugins.ts
  const pluginsPath = path.join(projectDir, 'plugins.ts');
  fs.writeFileSync(pluginsPath, pluginsTemplate, 'utf8');

  // Create bunfig.toml
  const bunfigPath = path.join(projectDir, 'bunfig.toml');
  fs.writeFileSync(bunfigPath, bunfigTemplate, 'utf8');

  // Create tsconfig.json
  const tsconfigPath = path.join(projectDir, 'tsconfig.json');
  fs.writeFileSync(tsconfigPath, tsconfigTemplate, 'utf8');

  // Create a readme file with information about the action
  const readmeContent = getReadmeContent(actionName, options, isViem);
  const readmePath = path.join(projectDir, 'README.md');
  fs.writeFileSync(readmePath, readmeContent, 'utf8');

  // Create a .installing file to indicate installation is in progress
  const waitingPath = path.join(projectDir, '.installing');
  fs.writeFileSync(waitingPath, 'Installing dependencies...', 'utf8');

  // Start bun install in the background
  const bunInstallProcess = spawn('bun', ['install'], {
    cwd: projectDir,
    stdio: 'ignore',
    shell: true,
    detached: true
  });

  // When the install completes, remove the waiting file
  bunInstallProcess.on('exit', () => {
    try {
      if (fs.existsSync(waitingPath)) {
        fs.unlinkSync(waitingPath);
        // Create a .ready file to indicate installation is complete
        fs.writeFileSync(path.join(projectDir, '.ready'), 'Dependencies installed successfully!', 'utf8');
      }
    } catch (error) {
      console.error('Failed to update installation status:', error);
    }
  });

  // Don't wait for it to complete - let it run in the background
  bunInstallProcess.unref();

  return { projectDir, scriptPath };
}

// Helper function to generate readme content based on action
function getReadmeContent(actionName: string, options: Record<string, any>, isViem: boolean): string {
  const apiType = isViem ? 'Viem' : 'TEVM';

  let readmeContent = `# TEVM ${actionName} Script

This temporary project was created by the TEVM CLI to help you execute a ${actionName} action using the ${apiType} API.

## What to do now?

1. Wait a few seconds for dependencies to install (happening in the background)
2. Edit the \`script.ts\` file that opened in your editor
3. Save the file and exit the editor when you're done
4. The script will execute automatically with Bun

## Current Configuration

- **Target RPC**: ${options['rpc'] || 'http://localhost:8545'}
`;

  // Add action-specific information
  if (actionName === 'call') {
    readmeContent += `- **Target Contract**: ${options['to'] || 'Not specified'}
- **From Account**: ${options['from'] || 'Not specified'}
${options['data'] ? `- **Call Data**: ${options['data']}` : ''}
`;
  } else if (actionName === 'readContract') {
    readmeContent += `- **Contract Address**: ${options['address'] || options['to'] || 'Not specified'}
- **Function Name**: ${options['functionName'] || 'Not specified'}
`;
  } else if (actionName === 'estimateGas') {
    readmeContent += `- **To Address**: ${options['to'] || 'Not specified'}
- **From Address**: ${options['from'] || 'Not specified'}
${options['data'] ? `- **Transaction Data**: ${options['data']}` : ''}
`;
  }

  readmeContent += `
## Documentation

- TEVM Documentation: https://tevm.sh/
- Viem Documentation: https://viem.sh/

## Troubleshooting

- If you encounter dependency issues, try running \`bun install\` manually in this directory
- Make sure your target RPC endpoint is accessible
- Check that your contract address and call data are valid
`;

  return readmeContent;
}

// Execute a TypeScript file using Bun and return the result
async function executeTsFile(scriptPath: string, projectDir: string): Promise<any> {
  return new Promise((resolve, reject) => {
    let stdout = '';
    let stderr = '';

    const bunProcess = spawn('bun', ['run', scriptPath], {
      cwd: projectDir,
      stdio: ['ignore', 'pipe', 'pipe'],
      shell: true
    });

    bunProcess.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    bunProcess.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    bunProcess.on('exit', (code) => {
      if (code === 0) {
        try {
          // Try to parse the output as JSON
          const result = JSON.parse(stdout.trim());
          resolve(result);
        } catch (error) {
          // If parsing fails, return the raw output
          resolve(stdout.trim());
        }
      } else {
        reject(new Error(`Execution failed (code ${code}): ${stderr}`));
      }
    });

    bunProcess.on('error', (error) => {
      reject(new Error(`Failed to execute: ${error.message}`));
    });
  });
}

// Helper function to clean up the project directory
function cleanupProject(projectDir: string): void {
  try {
    // Use recursive removal for directories
    const removeRecursive = (dir: string) => {
      if (fs.existsSync(dir)) {
        fs.readdirSync(dir).forEach((file) => {
          const curPath = path.join(dir, file);
          if (fs.lstatSync(curPath).isDirectory()) {
            // Recursive call for directories
            removeRecursive(curPath);
          } else {
            // Delete file
            fs.unlinkSync(curPath);
          }
        });
        fs.rmdirSync(dir);
      }
    };

    removeRecursive(projectDir);
  } catch (error) {
    console.error('Failed to clean up project directory:', error);
  }
}

// Helper function to open a file in an editor
async function openEditor(filePath: string): Promise<number> {
  // Use bracket notation for process.env access
  const editor = process.env['EDITOR'] || process.env['VISUAL'] ||
    (os.platform() === 'win32' ? 'notepad' : 'vim');

  console.log(`Opening ${filePath} with ${editor}...`);

  return new Promise((resolve) => {
    // Use spawn directly which we're already importing
    const editorProcess = spawn(editor, [filePath], {
      stdio: 'inherit', // This ensures terminal control is passed to the editor
      shell: true
    });

    // Handle process completion
    editorProcess.on('exit', (code) => {
      resolve(code || 0);
    });

    // Handle process errors
    editorProcess.on('error', (err) => {
      console.error('Failed to start editor:', err);
      resolve(1);
    });
  });
}

// Function to check if dependencies are installed
async function checkDependenciesInstalled(dir: string): Promise<boolean> {
  const waitingPath = path.join(dir, '.installing');
  const readyPath = path.join(dir, '.ready');

  // Check if dependencies are already installed
  if (fs.existsSync(readyPath)) {
    return true;
  }

  // Check if installation is still in progress
  if (fs.existsSync(waitingPath)) {
    return false;
  }

  // If neither file exists, likely the installation has completed but the status wasn't updated
  return true;
}

// Function to wait for dependencies to be installed
async function waitForDependencies(dir: string, timeout: number = 30000): Promise<void> {
  const startTime = Date.now();

  // Poll for installation completion
  while (Date.now() - startTime < timeout) {
    const isInstalled = await checkDependenciesInstalled(dir);
    if (isInstalled) {
      return;
    }
    await new Promise(resolve => setTimeout(resolve, 500)); // Check every 500ms
  }

  // If we get here, we've timed out
  console.warn('Dependency installation timed out, attempting to continue anyway...');
}

// Hook options type with improved typing
export interface UseActionOptions<TParams, TResult> {
  // Action identification
  actionName: string

  // Options and defaults
  options: Record<string, any>
  defaultValues: Record<string, any>
  optionDescriptions: Record<string, string>

  // Action-specific function to execute - note the improved typing for client
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

  // Use refs to track state
  const editorOpenedRef = React.useRef(false);
  const editorInProgressRef = React.useRef(false); // Add this new ref to track when editor is active
  const projectDirRef = React.useRef<string | null>(null);

  // Track if we're in the editor session - use this to prevent rendering UI during editing
  const [editorActive, setEditorActive] = React.useState(false);

  // Interactive editor query
  const {
    data: interactiveResult,
    isLoading: isInteractiveLoading,
    error: interactiveError,
    isSuccess: _isInteractiveSuccess
  } = useQuery({
    queryKey: [`interactive-editor-${actionName}`, JSON_BIG.stringify(baseOptions)],
    queryFn: async () => {
      try {
        // Don't run again if we've already opened the editor
        if (editorOpenedRef.current) {
          return projectDirRef.current ?
            await executeTsFile(path.join(projectDirRef.current, 'script.ts'), projectDirRef.current) :
            null;
        }

        // Set editor opened ref immediately to prevent reruns
        editorOpenedRef.current = true;

        // Create the TypeScript project
        const { projectDir, scriptPath } = await createTsProject(
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
        await openEditor(scriptPath);

        // Editor is now closed
        editorInProgressRef.current = false;
        setEditorActive(false);

        // Wait for dependencies to be installed
        await waitForDependencies(projectDir);

        // Execute the edited file
        return await executeTsFile(scriptPath, projectDir);
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

  // Action execution query - only runs when run flag is true
  const {
    isLoading: isActionLoading,
    error: actionError,
    data: result
  } = useQuery({
    queryKey: [actionName, JSON_BIG.stringify(baseOptions)],
    queryFn: async () => {
      let client;

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
      isInteractiveLoading: false, // Important: Set this to false to prevent loading UI
      isActionLoading: false,
      isInstallingDeps: false,
      interactiveError: null,
      actionError: null,
      options: baseOptions,
      editorActive: true // Add this flag to indicate editor is active
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
    interactiveError,
    actionError,

    // Options
    options: baseOptions,
    editorActive: false // Explicitly indicate editor is not active
  };
}

// Improved args parsing in createTsProject
function parseArgsForTemplate(value: any): string {
  if (typeof value !== 'string') return `${value}`;

  try {
    // Only try to parse if it looks like JSON
    if (value.trim().startsWith('[') || value.trim().startsWith('{')) {
      const parsedValue = JSON.parse(value);
      return JSON.stringify(parsedValue);
    }
  } catch (e) {
    // Parsing failed, so treat it as a regular string
  }

  // Return as quoted string
  return `"${value}"`;
}

// Fix the viem import issue by using a safer approach
const loadViemClient = async (rpcUrl: string) => {
  try {
    // This approach should be safer for TypeScript
    return await new Promise(async (resolve) => {
      try {
        // Using dynamic import with safety checks
        const module = await Function('return import("viem")')();
        const client = module.createPublicClient({
          transport: module.http(rpcUrl)
        });
        resolve(client);
      } catch (e) {
        console.error("Failed to load viem:", e);
        resolve(null);
      }
    });
  } catch (e) {
    console.error("Could not load viem client:", e);
    return null;
  }
};