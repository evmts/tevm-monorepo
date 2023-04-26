import type typescript from "typescript/lib/tsserverlibrary";

export const createLogger =
	(pluginCreateInfo: typescript.server.PluginCreateInfo) => (msg: string) =>
		pluginCreateInfo.project.projectService.logger.info(
			`[ts-graphql-plugin] ${msg}`,
		);
