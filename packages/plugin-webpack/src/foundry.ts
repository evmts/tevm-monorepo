import path from "pathe";
import { execaCommandSync } from "execa";
import { z } from "zod";

export const foundryConfigValidator = z.object({
  out: z.string().default("out"),
  src: z.string().default("src"),
});

export const forgeOptionsValidator = z.object({
  forgeExecutable: z
    .string()
    .optional()
    .default("forge")
    .describe("path to forge executable"),
  projectRoot: z
    .string()
    .optional()
    .default(process.cwd())
    .describe("path to project root"),
  deployments: z.record(z.string()).optional().default({}),
});

export type FoundryOptions = Partial<z.infer<typeof forgeOptionsValidator>>;

export const getFoundryConfig = ({
  forgeExecutable,
  projectRoot,
}: z.infer<typeof forgeOptionsValidator>) => {
  let config: z.infer<typeof foundryConfigValidator> = {
    src: "src",
    out: "out",
  };
  try {
    config = foundryConfigValidator.parse(
      JSON.parse(
        execaCommandSync(
          `${forgeExecutable} config --json --root ${projectRoot}`
        ).stdout
      )
    );
  } catch {
    console.warn("unable to parse foundry config, using defaults");
  } finally {
    config = {
      ...config,
      out: path.join(projectRoot, config.out),
    };
  }
  return config;
};
