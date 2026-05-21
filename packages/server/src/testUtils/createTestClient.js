/**
 * @typedef {{
 *   status: number
 *   headers: Record<string, string>
 *   text: string
 *   body: any
 * }} TestResponse
 */

/**
 * @param {unknown} target
 * @returns {Function}
 */
const getHandler = (target) => {
	if (typeof target === 'function') {
		return target
	}
	const listenerTarget = /** @type {{ listeners(event: string): Function[] }} */ (target)
	const [handler] = listenerTarget.listeners('request')
	if (!handler) {
		throw new Error('No request handler found')
	}
	return handler
}

/**
 * @param {string | number | readonly string[]} value
 */
const normalizeHeaderValue = (value) => {
	if (Array.isArray(value)) {
		return value.join(', ')
	}
	return String(value)
}

/**
 * @param {Function} handler
 * @param {{ method: string, url: string, headers: Record<string, string>, body?: unknown }} options
 * @returns {Promise<TestResponse>}
 */
const invokeHandler = async (handler, options) => {
	let status = 200
	const responseHeaders = /** @type {Record<string, string>} */ ({})
	const chunks = /** @type {Buffer[]} */ ([])

	const res = {
		headersSent: false,
		/**
		 * @param {string} name
		 * @param {string | number | readonly string[]} value
		 */
		setHeader(name, value) {
			responseHeaders[name.toLowerCase()] = normalizeHeaderValue(value)
		},
		/**
		 * @param {number} statusCode
		 * @param {Record<string, string | number | readonly string[]> | string} [headersOrMessage]
		 * @param {Record<string, string | number | readonly string[]>} [headers]
		 */
		writeHead(statusCode, headersOrMessage, headers) {
			status = statusCode
			const nextHeaders = typeof headersOrMessage === 'string' ? headers : headersOrMessage
			for (const [name, value] of Object.entries(nextHeaders ?? {})) {
				responseHeaders[name.toLowerCase()] = normalizeHeaderValue(value)
			}
			this.headersSent = true
			return this
		},
		/**
		 * @param {unknown} chunk
		 */
		write(chunk) {
			chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk)))
			return true
		},
		/**
		 * @param {unknown} [chunk]
		 */
		end(chunk) {
			if (chunk !== undefined) {
				this.write(chunk)
			}
			this.headersSent = true
			return this
		},
	}

	const headers = Object.fromEntries(
		Object.entries(options.headers).map(([name, value]) => [name.toLowerCase(), value]),
	)
	const rawHeaders = Object.entries(options.headers).flat()
	const req = {
		method: options.method,
		url: options.url,
		headers,
		rawHeaders,
		body: options.body,
		setTimeout: () => undefined,
		destroy: () => undefined,
	}

	await handler(req, res)

	const text = Buffer.concat(chunks).toString('utf8')
	const contentType = responseHeaders['content-type'] ?? ''
	let body = {}
	if (text.length > 0 && contentType.includes('json')) {
		body = JSON.parse(text)
	}
	return { status, headers: responseHeaders, text, body }
}

class TestRequest {
	/** @type {Function} */
	#handler
	/** @type {string} */
	#method
	/** @type {string} */
	#url
	/** @type {Record<string, string>} */
	#headers = {}
	/** @type {unknown} */
	#body
	/** @type {Promise<TestResponse> | undefined} */
	#promise
	/** @type {Array<(response: TestResponse) => void>} */
	#expectations = []

	/**
	 * @param {Function} handler
	 * @param {string} method
	 * @param {string} url
	 */
	constructor(handler, method, url) {
		this.#handler = handler
		this.#method = method
		this.#url = url
	}

	/**
	 * @param {string} name
	 * @param {string} value
	 */
	set(name, value) {
		this.#headers[name] = value
		return this
	}

	/**
	 * @param {unknown} body
	 */
	send(body) {
		this.#body = body
		if (
			body !== undefined &&
			typeof body !== 'string' &&
			!this.#headers['Content-Type'] &&
			!this.#headers['content-type']
		) {
			this.#headers['Content-Type'] = 'application/json'
		}
		return this
	}

	/**
	 * @param {number | string} statusOrHeader
	 * @param {string | RegExp} [expected]
	 */
	expect(statusOrHeader, expected) {
		if (typeof statusOrHeader === 'number') {
			this.#expectations.push((response) => {
				if (response.status !== statusOrHeader) {
					throw new Error(`Expected status ${statusOrHeader}, received ${response.status}`)
				}
			})
			return this
		}
		this.#expectations.push((response) => {
			const actual = response.headers[statusOrHeader.toLowerCase()]
			if (expected instanceof RegExp) {
				if (!expected.test(actual ?? '')) {
					throw new Error(`Expected header ${statusOrHeader} to match ${expected}, received ${actual}`)
				}
				return
			}
			if (actual !== expected) {
				throw new Error(`Expected header ${statusOrHeader} to be ${expected}, received ${actual}`)
			}
		})
		return this
	}

	/**
	 * @template TResult1
	 * @template TResult2
	 * @param {((value: TestResponse) => TResult1 | PromiseLike<TResult1>) | null} [onfulfilled]
	 * @param {((reason: any) => TResult2 | PromiseLike<TResult2>) | null} [onrejected]
	 * @returns {Promise<TResult1 | TResult2>}
	 */
	// biome-ignore lint/suspicious/noThenProperty: This test request helper intentionally supports await.
	then(onfulfilled, onrejected) {
		return this.#run().then(onfulfilled, onrejected)
	}

	/**
	 * @template TResult
	 * @param {((reason: any) => TResult | PromiseLike<TResult>) | null} [onrejected]
	 * @returns {Promise<TestResponse | TResult>}
	 */
	catch(onrejected) {
		return this.#run().catch(onrejected)
	}

	/**
	 * @param {(() => void) | null} [onfinally]
	 * @returns {Promise<TestResponse>}
	 */
	finally(onfinally) {
		return this.#run().finally(onfinally)
	}

	#run() {
		this.#promise ??= invokeHandler(this.#handler, {
			method: this.#method,
			url: this.#url,
			headers: this.#headers,
			body: this.#body,
		}).then((response) => {
			for (const expectation of this.#expectations) {
				expectation(response)
			}
			return response
		})
		return this.#promise
	}
}

/**
 * @param {unknown} target
 */
export const createTestClient = (target) => {
	const handler = getHandler(target)
	/** @param {string} url */
	const get = (url) => new TestRequest(handler, 'GET', url)
	/** @param {string} url */
	const post = (url) => new TestRequest(handler, 'POST', url)
	return {
		get,
		post,
	}
}
