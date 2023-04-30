import { isSolidity } from "../utils/isSolidity";
import { existsSync } from "fs";
import { createProxy } from "../factories/proxy";
import { Decorator } from "./Decorator";

/**
 * This appears to return a .d.ts file for a .sol file
 * @see https://github.com/mrmckeb/typescript-plugin-css-modules/blob/main/src/index.ts#LL128C2-L141C7
 */
export const getScriptSnapshotDecorator: Decorator = (host, createInfo) =>
	createProxy(host, {
		getScriptSnapshot: (fileName) => {
			if (isSolidity(fileName) && existsSync(fileName)) {
				console.log("TODO", fileName);
			}
			return createInfo.languageServiceHost.getScriptSnapshot(fileName);
		},
	});
