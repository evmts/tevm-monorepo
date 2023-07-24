export function expandEnv(str: string, env: typeof process.env) {
	console.log({
		str, env, out:
			str.replace(/\$[\w]+/g, function(match) {
				return env[match.replace('$', '')] || match
			})
	})
	return str.replace(/\$[\w]+/g, function(match) {
		return env[match.replace('$', '')] || match
	})
}
