import { describe, expect, it } from "vitest";
import { isSolidity } from "./isSolidity";

describe(isSolidity.name, () => {
	it("should return true for .sol files", () => {
		expect(isSolidity("foo.sol")).toBe(true);
	});

	it("should return false for non .sol files", () => {
		expect(isSolidity("foo.ts")).toBe(false);
	});
});
