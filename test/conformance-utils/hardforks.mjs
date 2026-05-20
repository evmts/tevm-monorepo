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
	frontier: 'frontier',
	eip150: 'tangerinewhistle',
	tangerinewhistle: 'tangerinewhistle',
	tangerineWhistle: 'tangerinewhistle',
	eip158: 'spuriousdragon',
	spuriousdragon: 'spuriousdragon',
	spuriousDragon: 'spuriousdragon',
	constantinoplefix: 'petersburg',
	muirGlacier: 'muirglacier',
	arrowGlacier: 'arrowglacier',
	grayGlacier: 'grayglacier',
	merge: 'paris',
	mergeforkidtransition: 'mergeforkidtransition',
	mergeForkIdTransition: 'mergeforkidtransition',
}

export const normalizeHardfork = (value) => {
	const key = (value ?? '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase()
	return HARD_FORK_ALIASES[key] ?? key
}

export const isHardforkSelected = (vectorHardfork, filter) => {
	if (!filter) return true
	const key = normalizeHardfork(filter)
	const selected = HARD_FORK_GROUPS[key] ?? [key]
	return selected.includes(normalizeHardfork(vectorHardfork))
}
