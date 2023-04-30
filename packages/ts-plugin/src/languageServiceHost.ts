import {
	composeDecorators,
	resolveModuleNameLiteralsDecorator,
	getScriptSnapshotDecorator,
	getScriptKindDecorator,
	Decorator,
} from "./decorators";

export const languageServiceHostDecorator: Decorator = composeDecorators(
	resolveModuleNameLiteralsDecorator,
	getScriptSnapshotDecorator,
	getScriptKindDecorator,
);
