import { z } from "zod";
import { generateRandomName } from "./utils/generateRandomName.js";

export const args = z.tuple([
  z
    .string()
    .optional()
    .default(generateRandomName())
    .describe(
      'The name of the application, as well as the name of the directory to create',
    ),
])
