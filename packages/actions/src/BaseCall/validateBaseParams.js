/**
 * Validates base parameters shared across tevm actions
 * @param {unknown} params - The parameters to validate
 * @returns {{ isValid: boolean, errors: Array<{path: string, message: string}> }} - Validation result
 */
export const validateBaseParams = (params) => {
  if (typeof params !== 'object' || params === null) {
    return { 
      isValid: false, 
      errors: [{ path: '', message: 'params must be an object' }] 
    }
  }
  
  const errors = []
  
  // Validate throwOnFail if present
  if ('throwOnFail' in params && params.throwOnFail !== undefined) {
    if (typeof params.throwOnFail !== 'boolean') {
      errors.push({
        path: 'throwOnFail',
        message: 'throwOnFail must be a boolean'
      })
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}