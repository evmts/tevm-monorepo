const resolutionsRs = require('@tevm/resolutions-rs')

console.log('Available exports:', Object.keys(resolutionsRs))

// Check if the native module is loaded correctly
console.log('Native binding details:')
try {
	const nativeBinding = require('../../../bundler-packages/resolutions-rs/tevm_resolutions_rs.darwin-arm64.node')
	console.log('Native binding exports:', Object.keys(nativeBinding))
} catch (e) {
	console.error('Error loading native binding:', e)
}

// Test calling the exports
console.log('\nTesting exports:')
for (const key of Object.keys(resolutionsRs)) {
	console.log(`- ${key} type:`, typeof resolutionsRs[key])
}
