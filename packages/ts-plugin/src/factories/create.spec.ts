import { describe, expect, it, vi } from "vitest";
import { createFactory } from "./create";
import typescript from "typescript/lib/tsserverlibrary";

// rome-ignore lint/suspicious/noExplicitAny: <explanation>
type TestAny = any;

describe(createFactory.name, () => {
	it("returns a typescript create", () => {
		const create = createFactory(typescript);
		const createInfo: typescript.server.PluginCreateInfo = {
			languageServiceHost: {
				resolveModuleNameLiterals: vi.fn(),
				getScriptSnapshot: vi.fn(),
				getScriptKind: vi.fn(),
				getResolvedModuleWithFailedLookupLocationsFromCache: vi.fn(),
			},
			project: {
				getCompilerOptions: () => ({ baseUrl: "foo" }),
				projectService: {
					logger: {
						info: vi.fn(),
					},
				},
			},
		} as TestAny;
		expect(create).toBeInstanceOf(Function);
		const host = create(createInfo);
		expect(host).toMatchInlineSnapshot(`
			{
			  "getResolvedModuleWithFailedLookupLocationsFromCache": [MockFunction spy],
			  "getScriptKind": [Function],
			  "getScriptSnapshot": [Function],
			  "resolveModuleNameLiterals": [Function],
			}
		`);
		expect(host.getScriptKind?.("foo.sol")).toBe(typescript.ScriptKind.TS);
		expect(host.getScriptKind?.("./foo.sol")).toBe(typescript.ScriptKind.TS);
	});
});
