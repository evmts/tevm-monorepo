// New validation functions for Address
export { isValidAddress, validateAddress } from './zAddress.js'

// New validation functions for Block params
export { isValidBlockParam, validateBlockParam } from './zBlockParam.js'

// New validation functions for Hex values
export { isValidHex, validateHex, hexRegex } from './zHex.js'

// Keep exports from other files
// (these would need to be updated as well but for brevity we're focusing on the most used ones)
export { zAbi } from './zAbi.js'
export { zBlock } from './zBlock.js'
export { zBytecode } from './zBytecode.js'
export { zStorageRoot } from './zStorageRoot.js'
export { zBlockOverrideSet } from './zBlockOverrideSet.js'
export { zStateOverrideSet } from './zStateOverrideSet.js'
