import type { InternalError } from "@tevm/errors";
import type { ValidateSetAccountParamsError } from "../zod/validators/validateSetAccountParams.js";

export type TevmSetAccountError = ValidateSetAccountParamsError | InternalError
