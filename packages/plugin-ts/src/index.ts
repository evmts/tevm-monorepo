import type typescript from "typescript/lib/tsserverlibrary";

function init(modules: {
	typescript: typeof import("typescript/lib/tsserverlibrary");
}) {
	const ts = modules.typescript;

	function create(info: typescript.server.PluginCreateInfo) {}

	return { create };
}

export = init;
