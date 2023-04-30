import { isSolidity } from "../utils/isSolidity";
import { Decorator } from "./Decorator";
import { createProxy } from "../factories";

export const getScriptKindDecorator: Decorator = (host, createInfo, ts) => {
	return createProxy(host, {
		getScriptKind: (fileName) => {
			if (!host.getScriptKind) {
				return ts.ScriptKind.Unknown;
			}
			if (isSolidity(fileName)) {
				return ts.ScriptKind.TS;
			}
			return host.getScriptKind(fileName);
		},
	});
};
