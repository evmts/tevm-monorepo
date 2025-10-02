import { createSolc, type SolcOutput, solcCompile } from '@tevm/solc'
import { z } from 'zod'

export type MessageResult = {
	success: boolean
	result: {
		data?: SolcOutput
		id: string
	}
	error?: string
}

/**
 * Log only in development
 */
const devConsole = new Proxy(console, {
	get(target, prop) {
		if (process.env.NODE_ENV === 'development') {
			return target[prop as keyof typeof target]
		}
		return () => {}
	},
})

let solc: any

const params = z.object({
	code: z.string(),
	id: z.string(),
})
// Solc is expensive to import expensive to compile and expensive to run
// Run it in a web worker so it always runs on a seperate thread
onmessage = async (e) => {
	const { code, id } = params.parse(e.data)

	devConsole.log('Compiling code', id, code)

	solc = solc ?? (await createSolc('0.8.23'))

	try {
		const result = {
			data: solcCompile(solc, {
				language: 'Solidity',
				settings: {
					outputSelection: {
						'*': {
							'*': ['*'],
						},
					},
				},
				sources: {
					'contract.sol': {
						content: code,
					},
				},
			}),
			id,
		}
		postMessage({ success: true, result })
	} catch (error) {
		postMessage({
			success: false,
			result: { id },
			error: error instanceof Error ? error.message : error,
		})
	}
}
