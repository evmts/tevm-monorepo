import { createClient } from './createClient.js'
import { publicActions } from './decorators/public.js'
export function createPublicClient(parameters) {
	const { key = 'public', name = 'Public Client' } = parameters
	const client = createClient({
		...parameters,
		key,
		name,
		type: 'publicClient',
	})
	return client.extend(publicActions)
}
//# sourceMappingURL=createPublicClient.js.map
