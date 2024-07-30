import { join } from 'node:path'
import { mkdtemp } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { write } from 'bun'

export const createBunConfig = async () => {
	const tempDir = await mkdtemp(join(tmpdir(), 'tevm-'))

	const packageJsonPath = join(tempDir, 'package.json')
	const packageContent = `{
  "type": "module",
}
`

	const pluginsPath = join(tempDir, 'plugins.mjs')
	const pluginsContent = `
import { tevmBunPlugin } from '@tevm/bun-plugin';
import { plugin } from 'bun';
plugin(tevmBunPlugin({}));
`

	const bunfigPath = join(tempDir, 'bunfig.toml')
	const bunfigContent = `
preload = ["${pluginsPath}"]
[test]
preload = ["${pluginsPath}"]
`
	await Promise.all([
		write(packageJsonPath, packageContent),
		write(bunfigPath, bunfigContent),
		write(pluginsPath, pluginsContent),
	])

	return { bunfig: bunfigPath, plugins: pluginsPath }
}
