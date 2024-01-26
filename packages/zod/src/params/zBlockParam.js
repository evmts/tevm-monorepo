import { z } from "zod";
import { zHex } from "../index.js";

export const zBlockParam = z.union([
  z.literal("latest"),
  z.literal("earliest"),
  z.literal("pending"),
  z.literal('safe'),
  z.bigint(),
  zHex,
])
