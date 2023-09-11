import { get } from 'node:https'

/**
 * @see https://nodejs.org/api/esm.html#https-loader
 *
 * @param {string} url
 * @param {any} _context
 * @param {(arg0: any) => any} nextLoad
 */
export function load(url, _context, nextLoad) {
	// For JavaScript to be loaded over the network, we need to fetch and
	// return it.
	if (url.startsWith('https://')) {
		return new Promise((resolve, reject) => {
			get(url, (res) => {
				let data = ''
				res.setEncoding('utf8')
				// rome-ignore lint/suspicious/noAssignInExpressions: <explanation>
				res.on('data', (chunk) => (data += chunk))
				res.on('end', () =>
					resolve({
						// This example assumes all network-provided JavaScript is ES module
						// code.
						format: 'module',
						shortCircuit: true,
						source: data,
					}),
				)
			}).on('error', (err) => reject(err))
		})
	}

	// Let Node.js handle all other URLs.
	return nextLoad(url)
}
