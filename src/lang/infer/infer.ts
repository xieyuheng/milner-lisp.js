import type { Ctx } from "../ctx/index.ts"
import type { Exp } from "../exp/index.ts"
import type { Subst } from "../subst/index.ts"
import type { Type } from "../type/index.ts"

export type Inferred = { subst: Subst; type: Type }

export function infer(ctx: Ctx, exp: Exp) {
  throw new Error()
}
