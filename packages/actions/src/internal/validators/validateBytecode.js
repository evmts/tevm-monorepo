import { validateHex } from './validateHex.js'

/**
 * Validates if a value is valid EVM bytecode
 * @param {unknown} value - The value to validate
 * @returns {{ isValid: boolean, message?: string }} - Validation result
 */
export const validateBytecode = (value) => {
  // EVM bytecode must be a hex string
  const hexValidation = validateHex(value)
  if (!hexValidation.isValid) {
    return hexValidation
  }
  
  // If bytecode length is odd (minus 0x prefix), it's invalid
  const bytecodeStr = /** @type {string} */(value)
  if ((bytecodeStr.length - 2) % 2 !== 0) {
    return { 
      isValid: false, 
      message: 'Bytecode must have an even number of hex characters (after 0x prefix)' 
    }
  }
  
  return { isValid: true }
}