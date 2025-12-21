import type { EIP1193Parameters, EIP1474Methods } from 'viem'
import { http } from 'viem'
import type { PassthroughConfig } from '../types.js'

/**
 * Resolves the passthrough transport URL for a given RPC method based on the passthrough configuration.
 * 
 * @param method - The JSON-RPC method name
 * @param params - The JSON-RPC parameters
 * @param passthroughConfig - The passthrough configuration
 * @returns The transport to use for the request, or undefined to use the default fork transport
 *
 * @example
 * ```typescript
 * import { resolvePassthroughTransport } from '@tevm/test-node/internal'
 * 
 * const config = {
 *   methodUrls: { 'eth_call': 'https://oracle.example.com' },
 *   nonCachedMethods: ['eth_blockNumber'],
 *   defaultUrl: 'https://fallback.example.com'
 * }
 * 
 * const transport = resolvePassthroughTransport('eth_call', [], config)
 * // Returns transport pointing to https://oracle.example.com
 * ```
 */
export const resolvePassthroughTransport = (
	method: string,
	_params: EIP1193Parameters<EIP1474Methods>['params'],
	passthroughConfig: PassthroughConfig,
) => {
	// Check if method should use specific URL
	if (passthroughConfig.methodUrls?.[method]) {
		return {
			request: http(passthroughConfig.methodUrls[method])({}).request,
		}
	}

	// Check if method is in non-cached methods list
	if (passthroughConfig.nonCachedMethods?.includes(method)) {
		const url = passthroughConfig.defaultUrl
		if (!url) {
			throw new Error(`Method ${method} is configured as non-cached but no defaultUrl provided`)
		}
		return {
			request: http(url)({}).request,
		}
	}

	// Check URL patterns
	if (passthroughConfig.urlPatterns) {
		for (const pattern of passthroughConfig.urlPatterns) {
			if (pattern.pattern.test(method)) {
				return {
					request: http(pattern.url)({}).request,
				}
			}
		}
	}

	// No passthrough configuration matches
	return undefined
}

/**
 * Determines if a method should bypass caching based on passthrough configuration.
 * 
 * @param method - The JSON-RPC method name
 * @param passthroughConfig - The passthrough configuration
 * @returns true if the method should bypass caching
 *
 * @example
 * ```typescript
 * import { shouldBypassCache } from '@tevm/test-node/internal'
 * 
 * const config = {
 *   nonCachedMethods: ['eth_blockNumber'],
 *   urlPatterns: [{ pattern: /eth_call/, url: 'https://oracle.example.com', bypassCache: true }]
 * }
 * 
 * shouldBypassCache('eth_blockNumber', config) // true
 * shouldBypassCache('eth_call', config) // true
 * shouldBypassCache('eth_getBalance', config) // false
 * ```
 */
export const shouldBypassCache = (method: string, passthroughConfig: PassthroughConfig): boolean => {
	// Check if method is in non-cached methods list
	if (passthroughConfig.nonCachedMethods?.includes(method)) {
		return true
	}

	// Check URL patterns with bypassCache flag
	if (passthroughConfig.urlPatterns) {
		for (const pattern of passthroughConfig.urlPatterns) {
			if (pattern.pattern.test(method) && pattern.bypassCache) {
				return true
			}
		}
	}

	return false
}