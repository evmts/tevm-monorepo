import { defineConfig, readDeployments } from '@evmts/config'

export default defineConfig(() => ({
	deployments: readDeployments('deployments'),
}))
