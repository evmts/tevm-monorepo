export function createTsUpOptions({ entry, outDir, target, format, }: {
    entry?: string[] | undefined;
    outDir?: string | undefined;
    target?: import("./targets.js").Target | undefined;
    format?: ("cjs" | "esm")[] | undefined;
}): import('tsup').Options;
//# sourceMappingURL=createTsupOptions.d.ts.map