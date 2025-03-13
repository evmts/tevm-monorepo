import { validateHex } from './validateHex.js'

/**
 * Validates if a value is a valid block parameter
 * @param {unknown} value - The value to validate
 * @returns {{ isValid: boolean, message?: string }} - Validation result
 */
export const validateBlockParam = (value) => {
  // Check for string literals
  if (typeof value === 'string') {
    const validStringLiterals = ['latest', 'earliest', 'pending', 'safe', 'finalized']
    if (validStringLiterals.includes(value)) {
      return { isValid: true }
    }
    
    // Check if it's a hex string
    const hexValidation = validateHex(value)
    if (hexValidation.isValid) {
      return { isValid: true }
    }
    
    return { isValid: false, message: `Block parameter must be one of ${validStringLiterals.join(', ')} or a valid hex string` }
  }
  
  // Check for bigint
  if (typeof value === 'bigint') {
    return { isValid: true }
  }
  
  // Check for number (convert to bigint)
  if (typeof value === 'number') {
    if (Number.isInteger(value) && value >= 0) {
      return { isValid: true }
    }
    return { isValid: false, message: 'Block number must be a non-negative integer' }
  }
  
  return { 
    isValid: false, 
    message: 'Block parameter must be a string literal (latest, earliest, pending, safe, finalized), a non-negative number, a bigint, or a hex string' 
  }
}