export function expandEnv(str: string, env: typeof process.env) {
	return str.replace(/\$[\w]+/g, function (match) {
		return env[match.replace('$', '')] || match
	})
}
