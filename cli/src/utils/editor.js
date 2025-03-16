/**
 * Utilities for handling interactive editor functionality
 */
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'
import { spawn } from 'node:child_process'
import { generateTemplates } from './templates.js'

/**
 * Creates a TypeScript project for interactive editing
 * @param {string} actionName - The name of the action being executed
 * @param {Object} options - The options for the action
 * @param {Function} createParams - Function to create params from options
 * @returns {Promise<string>} - The path to the created project directory
 */
export async function createEditorProject(actionName, options, createParams) {
  // Create a temporary directory
  const tmpDir = os.tmpdir();
  const projectDir = path.join(tmpDir, `tevm-${actionName}-${Date.now()}`);
  fs.mkdirSync(projectDir, { recursive: true });

  // Generate the template files
  const templates = generateTemplates(actionName, options, createParams);

  // Write all template files to the project directory
  const filesToWrite = {
    'package.json': templates.packageJson,
    'script.ts': templates.scriptTemplate,
    'plugins.ts': templates.pluginsTemplate,
    'bunfig.toml': templates.bunfigTemplate,
    'tsconfig.json': templates.tsconfigTemplate,
    'README.md': templates.readmeContent
  };

  // Write each file
  Object.entries(filesToWrite).forEach(([filename, content]) => {
    fs.writeFileSync(path.join(projectDir, filename), content, 'utf8');
  });

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

  return projectDir;
}

/**
 * Opens a file in the user's preferred editor
 * @param {string} projectDir - The project directory
 * @returns {Promise<number>} - The exit code from the editor
 */
export async function openEditor(projectDir) {
  const scriptPath = path.join(projectDir, 'script.ts');
  const editor = process.env['EDITOR'] || process.env['VISUAL'] || 
    (os.platform() === 'win32' ? 'notepad' : 'vim');

  console.log(`Opening ${scriptPath} with ${editor}...`);

  return new Promise((resolve) => {
    const editorProcess = spawn(editor, [scriptPath], {
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

/**
 * Executes a TypeScript file using Bun and returns the result
 * @param {string} projectDir - The project directory
 * @returns {Promise<any>} - The result of the execution
 */
export async function executeTsFile(projectDir) {
  const scriptPath = path.join(projectDir, 'script.ts');
  
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

/**
 * Cleans up the project directory
 * @param {string} projectDir - The project directory to clean up
 */
export function cleanupProject(projectDir) {
  try {
    // Use recursive removal for directories
    const removeRecursive = (dir) => {
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

/**
 * Checks if dependencies are installed
 * @param {string} dir - The project directory
 * @returns {Promise<boolean>} - True if dependencies are installed, false otherwise
 */
export async function checkDependenciesInstalled(dir) {
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

/**
 * Waits for dependencies to be installed
 * @param {string} dir - The project directory
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Promise<void>}
 */
export async function waitForDependencies(dir, timeout = 30000) {
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