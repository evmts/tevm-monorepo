import { execa } from "execa";
// @ts-ignore - TODO figure out why these types don't work
import fs from "fs-extra/esm";
import { globby } from "globby";
import { basename, extname } from "pathe";
import type { Plugin } from "rollup";
import { z } from "zod";

import type { FoundryOptions } from "./foundry";
import { forgeOptionsValidator, getFoundryConfig } from "./foundry";

function getContractName(artifactPath: string) {
  const filename = basename(artifactPath);
  const extension = extname(artifactPath);
  return filename.replace(extension, "");
}

/**
 * Expected shape of the forge artifacts
 */
export const forgeArtifactsValidator = z.object({
  abi: z.array(
    z.object({
      inputs: z.array(
        z.object({
          internalType: z.string(),
          name: z.string(),
          type: z.string(),
        })
      ),
      name: z.string(),
      outputs: z
        .array(
          z.object({
            internalType: z.string(),
            name: z.string(),
            type: z.string(),
          })
        )
        .optional(),
      stateMutability: z.string().optional(),
      type: z.string(),
    })
  ),
  bytecode: z.object({
    object: z.string(),
    sourceMap: z.string(),
  }),
});

async function getContract(
  artifactPath: string,
  deployments: Record<string, string>
) {
  const json = await fs.readJSON(artifactPath);
  const artifact = forgeArtifactsValidator.parse(json);
  return {
    name: getContractName(artifactPath),
    artifactPath,
    ...artifact,
    address: deployments[getContractName(artifactPath)],
  };
}

export function envTsPluginRollup(options: FoundryOptions = {}): Plugin {
  const foundryOptions = forgeOptionsValidator.parse(options);
  const foundryConfig = getFoundryConfig(foundryOptions);

  const contracts: Record<string, Awaited<ReturnType<typeof getContract>>> = {};

  /**
   * @see wagmis implementation as reference https://github.com/wagmi-dev/wagmi/blob/main/packages/cli/src/plugins/foundry.ts
   */
  const getArtifactPaths = async (artifactsDirectory: string) => {
    const include = ["*.json"];
    return globby(include.map((x) => `${artifactsDirectory}/**/${x}`));
  };

  return {
    name: "@evmts/plugin-rollup",
    version: "0.0.0",
    buildStart: async () => {
      await execa(foundryOptions.forgeExecutable, [
        "build",
        "--root",
        foundryOptions.projectRoot,
      ]);

      if (!(await fs.pathExists(foundryConfig.out))) {
        throw new Error("artifacts directory does not exist");
      }
      const artifactsPaths = await getArtifactPaths(foundryConfig.out);
      for (const artifactsPath of artifactsPaths) {
        const contract = await getContract(
          artifactsPath,
          foundryOptions.deployments
        );
        if (!contract.abi?.length) {
          continue;
        }
        const contractName = artifactsPath.split("/").at(-2);
        if (!contractName) {
          throw new Error("contract name not found");
        }
        contracts[contractName] = contract;
      }
    },
    load(id) {
      if (!id.endsWith(".sol")) {
        return;
      }
      console.log("loading solidity file", { id });

      const contractName = id.split("/").at(-1);

      if (!contractName) {
        throw new Error("contract name not found");
      }

      const contract = contracts[contractName];

      const out = `
        export default ${JSON.stringify(contract, null, 2)}
      `;
      console.log({ out, id, keys: Object.keys(contracts) });
      return out;
    },
  };
}
