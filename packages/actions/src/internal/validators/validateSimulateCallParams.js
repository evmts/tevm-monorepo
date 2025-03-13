import { validateBlockParam } from './validateBlockParam.js'
import { validateHex } from './validateHex.js'

/**
 * Validates simulation parameters
 * @param {unknown} params - The parameters to validate
 * @returns {{ isValid: boolean, errors: Array<{path: string, message: string}> }} - Validation result
 */
export const validateSimulateCallParams = (params) => {
  if (typeof params !== 'object' || params === null) {
    return { 
      isValid: false, 
      errors: [{ path: '', message: 'params must be an object' }] 
    }
  }
  
  const errors = []
  
  // blockTag/blockNumber/blockHash is required
  if (!('blockTag' in params || 'blockNumber' in params || 'blockHash' in params)) {
    errors.push({
      path: '',
      message: 'At least one of blockTag, blockNumber, or blockHash must be provided'
    })
  }
  
  // Validate blockTag/blockNumber/blockHash
  if ('blockTag' in params && params.blockTag !== undefined) {
    const blockTagValidation = validateBlockParam(params.blockTag)
    if (!blockTagValidation.isValid) {
      errors.push({
        path: 'blockTag',
        message: blockTagValidation.message || 'Invalid blockTag'
      })
    }
  }
  
  if ('blockNumber' in params && params.blockNumber !== undefined) {
    if (typeof params.blockNumber !== 'number' && typeof params.blockNumber !== 'bigint') {
      errors.push({
        path: 'blockNumber',
        message: 'blockNumber must be a number or bigint'
      })
    } else if ((typeof params.blockNumber === 'number' && params.blockNumber < 0) || 
              (typeof params.blockNumber === 'bigint' && params.blockNumber < 0n)) {
      errors.push({
        path: 'blockNumber',
        message: 'blockNumber must be non-negative'
      })
    }
  }
  
  if ('blockHash' in params && params.blockHash !== undefined) {
    const hashValidation = validateHex(params.blockHash)
    if (!hashValidation.isValid) {
      errors.push({
        path: 'blockHash',
        message: hashValidation.message || 'Invalid blockHash'
      })
    }
  }
  
  // Validate transactionIndex
  if ('transactionIndex' in params && params.transactionIndex !== undefined) {
    if (typeof params.transactionIndex !== 'number' && typeof params.transactionIndex !== 'bigint') {
      errors.push({
        path: 'transactionIndex',
        message: 'transactionIndex must be a number or bigint'
      })
    } else if ((typeof params.transactionIndex === 'number' && params.transactionIndex < 0) || 
              (typeof params.transactionIndex === 'bigint' && params.transactionIndex < 0n)) {
      errors.push({
        path: 'transactionIndex',
        message: 'transactionIndex must be non-negative'
      })
    }
  }
  
  // Validate transactionHash
  if ('transactionHash' in params && params.transactionHash !== undefined) {
    const hashValidation = validateHex(params.transactionHash)
    if (!hashValidation.isValid) {
      errors.push({
        path: 'transactionHash',
        message: hashValidation.message || 'Invalid transactionHash'
      })
    }
  }
  
  // Cannot have both transactionIndex and transactionHash
  if ('transactionIndex' in params && params.transactionIndex !== undefined &&
      'transactionHash' in params && params.transactionHash !== undefined) {
    errors.push({
      path: '',
      message: 'Cannot specify both transactionIndex and transactionHash'
    })
  }
  
  // Validate call parameters if present
  // We'll do additional validation in the handler when merging with a transaction
  
  return {
    isValid: errors.length === 0,
    errors
  }
}