import type typescript from "typescript/lib/tsserverlibrary";

export type Logger = {
	info: (msg: string) => void;
	warn: (msg: string) => void;
	error: (msg: string) => void;
};

export const createLogger = (
	pluginCreateInfo: typescript.server.PluginCreateInfo,
): Logger => {
	const info = (msg: string) =>
		pluginCreateInfo.project.projectService.logger.info(
			`[evmts-ts-plugin] ${msg}`,
		);
	const warn = (msg: string) =>
		pluginCreateInfo.project.projectService.logger.info(
			`[evmts-ts-plugin] ${msg}`,
		);
	const error = (msg: string) =>
		pluginCreateInfo.project.projectService.logger.info(
			`[evmts-ts-plugin] ${msg}`,
		);
	return { info, warn, error };
};
