import type { Language } from '@volar/language-core'
import { SolidityFile } from './SolidityFile.js'

/**
 * Solidity language implementation for Volar
 * 
 * This handles the creation and updating of virtual files for .sol files
 */
export const solidityLanguage: Language<SolidityFile> = {
  /**
   * Create a virtual file for a Solidity file
   * @param fileName The file name
   * @param snapshot The file snapshot
   * @returns A SolidityFile if the file is a Solidity file, undefined otherwise
   */
  createVirtualFile(fileName, snapshot) {
    if (fileName.endsWith('.sol')) {
      return new SolidityFile(fileName, snapshot)
    }
    return undefined
  },

  /**
   * Update an existing virtual file with a new snapshot
   * @param solFile The Solidity file to update
   * @param snapshot The new snapshot
   */
  updateVirtualFile(solFile, snapshot) {
    solFile.update(snapshot)
  },
}