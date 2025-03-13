import { validateAddress } from './validateAddress.js'

/**
 * Validates if a value is a valid block override set
 * @param {unknown} value - The value to validate
 * @returns {{ isValid: boolean, errors: Array<{path: string, message: string}> }} - Validation result
 */
export const validateBlockOverrideSet = (value) => {
  if (typeof value !== 'object' || value === null) {
    return { 
      isValid: false, 
      errors: [{ path: '', message: 'Block override set must be an object' }] 
    }
  }
  
  const errors = []
  
  // Define the bigint fields that must be non-negative
  const bigintFields = ['number', 'time', 'gasLimit', 'baseFee', 'blobBaseFee']
  
  for (const field of bigintFields) {
    if (field in value && value[field] !== undefined) {
      if (typeof value[field] !== 'bigint') {
        errors.push({
          path: field,
          message: `${field} must be a bigint`
        })
      } else if (value[field] < 0n) {
        errors.push({
          path: field,
          message: `${field} must be non-negative`
        })
      }
    }
  }
  
  // Validate coinbase if present
  if ('coinbase' in value && value.coinbase !== undefined) {
    const coinbaseValidation = validateAddress(value.coinbase)
    if (!coinbaseValidation.isValid) {
      errors.push({
        path: 'coinbase',
        message: coinbaseValidation.message || 'Invalid coinbase address'
      })
    }
  }
  
  // Check for unknown properties
  const validProperties = [...bigintFields, 'coinbase']
  for (const key in value) {
    if (!validProperties.includes(key)) {
      errors.push({
        path: key,
        message: `Unknown property in block override set: ${key}`
      })
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}