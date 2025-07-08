import { ctxFind, type Ctx } from "../ctx/index.ts"
import type { Exp } from "../exp/index.ts"
import { substEmpty, type Subst } from "../subst/index.ts"
import type { Type, TypeScheme } from "../type/index.ts"

export type Inferred = { subst: Subst; type: Type }

export function typeSchemeGen(typeScheme: TypeScheme): Type {
  throw new Error()
}

export function infer(ctx: Ctx, exp: Exp): Inferred {
  switch (exp.kind) {
    case "Var": {
      const typeScheme = ctxFind(ctx, exp.name)
      if (!typeScheme) throw new Error(`[infer] undefined name: ${exp.name}`)
      return {
        subst: substEmpty(),
        type: typeSchemeGen(typeScheme),
      }
    }

    case "Lambda": {
      throw new Error()
    }

    case "Apply": {
      throw new Error()
    }

    case "Let": {
      throw new Error()
    }
  }
}
