import type { InvalidRequestError } from "@tevm/errors";
import type { TevmCallError } from "./TevmCallError.js";
import type { TevmSetAccountError } from "./TevmSetAccountError.js";

export type TevmScriptError = TevmCallError | TevmSetAccountError | InvalidRequestError
