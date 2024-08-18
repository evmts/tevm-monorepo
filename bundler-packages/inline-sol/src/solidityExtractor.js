// TODO we can use parseAsync and transferAsync later to make this non blocking
// TODO we can do a quick regex check for the import statement and then do the full parse only if it is present
// Remember to handle cjs too if doing regex check
// TODO we should use swc rather than babel. But swc plugins must be written in rust so we start with babel for now to ship faster. Moving to swc will be non breaking change
import * as babel from '@babel/core'

/**
 * Extracts Solidity code from a given JavaScript/TypeScript source string using Babel.
 *
 * @param {string} code - The source code to analyze.
 * @returns {{ code: string, solidityCode: string | null }} - The transformed code with Solidity code replaced by an error.
 */
export function extractSolidity(code) {
	let solidityCode = null

	// Transform the JavaScript/TypeScript code using Babel
	const result = babel.transformSync(code, {
		plugins: [
			function solidityPlugin() {
				return {
					visitor: {
						TaggedTemplateExpression(path) {
							if (path.node.tag.name === 'sol') {
								solidityCode = path.node.quasi.quasis.map((q) => q.value.cooked).join('')
								console.log('Extracted Solidity code:', solidityCode)

								// Replace with an error throw
								path.replaceWithSourceString(
									`throw new Error('Solidity code needs to be compiled by the TEVM compiler.')`,
								)
							}
						},
					},
				}
			},
		],
		parserOpts: {
			sourceType: 'module',
			plugins: ['typescript'],
		},
	})

	return {
		code: result.code,
		solidityCode,
	}
}
