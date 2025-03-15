import { spawn } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import os from 'node:os'

/**
 * Opens the user's preferred editor with initial content and returns the edited content
 * @param initialContent The initial content to populate the file with
 * @param fileExtension The file extension to use for the temporary file
 * @returns The content after user editing
 */
export async function openEditor(initialContent: string, fileExtension = 'json'): Promise<string> {
  // Create a temporary file
  const tmpDir = os.tmpdir()
  const tmpFile = path.join(tmpDir, `tevm-edit-${Date.now()}.${fileExtension}`)

  // Write initial content
  fs.writeFileSync(tmpFile, initialContent, 'utf8')

  // Get editor from environment or fallback to common editors
  const editor = process.env['EDITOR'] || process.env['VISUAL'] ||
    (os.platform() === 'win32' ? 'notepad' : 'vim')

  // Open the editor
  return new Promise((resolve, reject) => {
    const editorProcess = spawn(editor, [tmpFile], {
      stdio: 'inherit',
      shell: true
    })

    editorProcess.on('exit', (code) => {
      if (code === 0) {
        try {
          // Read the updated content
          const editedContent = fs.readFileSync(tmpFile, 'utf8')
          // Clean up the temporary file
          fs.unlinkSync(tmpFile)
          resolve(editedContent)
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : String(error)
          reject(new Error(`Failed to read edited file: ${errorMessage}`))
        }
      } else {
        fs.unlinkSync(tmpFile)
        reject(new Error(`Editor exited with code ${code}`))
      }
    })

    editorProcess.on('error', (error: unknown) => {
      fs.unlinkSync(tmpFile)
      const errorMessage = error instanceof Error ? error.message : String(error)
      reject(new Error(`Failed to launch editor: ${errorMessage}`))
    })
  })
}