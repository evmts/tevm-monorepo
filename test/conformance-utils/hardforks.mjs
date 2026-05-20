export const HARD_FORK_GROUPS = {
  frontier: ['chainstart', 'homestead', 'dao', 'tangerinewhistle', 'spuriousdragon', 'frontier'],
  homestead: ['homestead'],
  dao: ['dao'],
  tangerinewhistle: ['tangerinewhistle'],
  spuriousdragon: ['spuriousdragon'],
  byzantium: ['byzantium'],
  constantinople: ['constantinople', 'petersburg'],
  petersburg: ['petersburg'],
  istanbul: ['istanbul', 'muirglacier'],
  muirglacier: ['muirglacier'],
  berlin: ['berlin'],
  london: ['london', 'arrowglacier', 'grayglacier', 'mergeforkidtransition', 'paris'],
  arrowglacier: ['arrowglacier'],
  grayglacier: ['grayglacier'],
  mergeforkidtransition: ['mergeforkidtransition'],
  paris: ['paris'],
  shanghai: ['shanghai'],
  cancun: ['cancun'],
  prague: ['prague'],
  osaka: ['osaka'],
}

const HARD_FORK_ALIASES = {
  chainstart: 'frontier',
  tangerinewhistle: 'tangerinewhistle',
  spuriousdragon: 'spuriousdragon',
  mergeforkidtransition: 'mergeforkidtransition',
}

export const normalizeHardfork = (value) => {
  const key = (value ?? '').toLowerCase()
  return HARD_FORK_ALIASES[key] ?? key
}

export const isHardforkSelected = (vectorHardfork, filter) => {
  if (!filter) return true
  const key = normalizeHardfork(filter)
  const selected = HARD_FORK_GROUPS[key] ?? [key]
  return selected.includes(normalizeHardfork(vectorHardfork))
}
