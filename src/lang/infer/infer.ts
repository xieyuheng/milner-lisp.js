import { ctxFind, ctxUpdate, type Ctx } from "../ctx/index.ts"
import type { Exp } from "../exp/index.ts"
import {
  substComposeMany,
  substDeepWalk,
  substEmpty,
  substOnCtx,
  type Subst,
} from "../subst/index.ts"
import * as Types from "../type/index.ts"
import {
  typeClosure,
  typeSchemeGen,
  typeVarGen,
  type Type,
  type TypeScheme,
} from "../type/index.ts"
import { unifyType } from "../unify/index.ts"

export function inferTypeScheme(ctx: Ctx, exp: Exp): TypeScheme {
  const [subst, type] = infer(ctx, exp)
  return typeClosure(substOnCtx(subst, ctx), substDeepWalk(subst, type))
}

export function infer(ctx: Ctx, exp: Exp): [Subst, Type] {
  switch (exp.kind) {
    case "Var": {
      const typeScheme = ctxFind(ctx, exp.name)
      if (!typeScheme) throw new Error(`[infer] undefined name: ${exp.name}`)
      return [substEmpty(), typeSchemeGen(typeScheme)]
    }

    case "Apply": {
      const [targetSubst, targetType] = infer(ctx, exp.target)
      const [argSubst, argType] = infer(substOnCtx(targetSubst, ctx), exp.arg)
      const retType = typeVarGen()
      const lastSubst = unifyType(
        substDeepWalk(argSubst, targetType),
        Types.Arrow(argType, retType),
      )(substEmpty())
      if (!lastSubst) throw new Error("[infer] fail on apply")

      return [
        substComposeMany([lastSubst, argSubst, targetSubst]),
        substDeepWalk(lastSubst, retType),
      ]
    }

    case "Lambda": {
      const argType = typeVarGen()
      const [retSubst, retType] = infer(
        ctxUpdate(ctx, exp.name, argType),
        exp.ret,
      )
      return [retSubst, Types.Arrow(argType, retType)]
    }

    case "Let": {
      const [rhsSubst, rhsType] = infer(ctx, exp.rhs)
      const rhsTypeScheme = typeClosure(substOnCtx(rhsSubst, ctx), rhsType)
      const bodyCtx = substOnCtx(
        rhsSubst,
        ctxUpdate(ctx, exp.name, rhsTypeScheme),
      )
      const [bodySubst, bodyType] = infer(bodyCtx, exp.body)
      return [substComposeMany([bodySubst, rhsSubst]), bodyType]
    }
  }
}
