import * as react from 'react';
import * as zod from 'zod';
import { z } from 'zod';

declare const args: z.ZodTuple<[z.ZodDefault<z.ZodOptional<z.ZodString>>], null>;

declare const options: z.ZodObject<{
    skipPrompts: z.ZodDefault<z.ZodBoolean>;
    walletConnectProjectId: z.ZodDefault<z.ZodString>;
    packageManager: z.ZodDefault<z.ZodEnum<["pnpm", "npm", "bun", "yarn"]>>;
    useCase: z.ZodDefault<z.ZodEnum<["simple", "ui", "server"]>>;
    framework: z.ZodDefault<z.ZodEnum<["simple", "mud", "server", "pwa", "next", "remix", "bun"]>>;
    noGit: z.ZodDefault<z.ZodBoolean>;
    noInstall: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    skipPrompts: boolean;
    walletConnectProjectId: string;
    packageManager: "npm" | "pnpm" | "bun" | "yarn";
    useCase: "simple" | "ui" | "server";
    framework: "bun" | "simple" | "server" | "mud" | "pwa" | "next" | "remix";
    noGit: boolean;
    noInstall: boolean;
}, {
    skipPrompts?: boolean | undefined;
    walletConnectProjectId?: string | undefined;
    packageManager?: "npm" | "pnpm" | "bun" | "yarn" | undefined;
    useCase?: "simple" | "ui" | "server" | undefined;
    framework?: "bun" | "simple" | "server" | "mud" | "pwa" | "next" | "remix" | undefined;
    noGit?: boolean | undefined;
    noInstall?: boolean | undefined;
}>;

declare const command: {
    args: zod.ZodTuple<[zod.ZodDefault<zod.ZodOptional<zod.ZodString>>], null>;
    options: zod.ZodObject<{
        skipPrompts: zod.ZodDefault<zod.ZodBoolean>;
        walletConnectProjectId: zod.ZodDefault<zod.ZodString>;
        packageManager: zod.ZodDefault<zod.ZodEnum<["pnpm", "npm", "bun", "yarn"]>>;
        useCase: zod.ZodDefault<zod.ZodEnum<["simple", "ui", "server"]>>;
        framework: zod.ZodDefault<zod.ZodEnum<["simple", "mud", "server", "pwa", "next", "remix", "bun"]>>;
        noGit: zod.ZodDefault<zod.ZodBoolean>;
        noInstall: zod.ZodDefault<zod.ZodBoolean>;
    }, "strip", zod.ZodTypeAny, {
        skipPrompts: boolean;
        walletConnectProjectId: string;
        packageManager: "npm" | "pnpm" | "bun" | "yarn";
        useCase: "simple" | "ui" | "server";
        framework: "bun" | "simple" | "server" | "mud" | "pwa" | "next" | "remix";
        noGit: boolean;
        noInstall: boolean;
    }, {
        skipPrompts?: boolean | undefined;
        walletConnectProjectId?: string | undefined;
        packageManager?: "npm" | "pnpm" | "bun" | "yarn" | undefined;
        useCase?: "simple" | "ui" | "server" | undefined;
        framework?: "bun" | "simple" | "server" | "mud" | "pwa" | "next" | "remix" | undefined;
        noGit?: boolean | undefined;
        noInstall?: boolean | undefined;
    }>;
    Component: react.FC<{
        options: zod.TypeOf<typeof options>;
        args: zod.TypeOf<typeof args>;
    }>;
};

export { command };
