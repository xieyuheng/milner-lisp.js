import { ctxFind, ctxUpdate, type Ctx } from "../ctx/index.ts"
import type { Exp } from "../exp/index.ts"
import { reifyTypeScheme } from "../reify/reifyTypeScheme.ts"
import {
  emptySubst,
  substDeepWalk,
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
  const state = { subst: emptySubst() }
  const type = infer(ctx, state, exp)
  return reifyTypeScheme(
    typeClosure(substOnCtx(state.subst, ctx), substDeepWalk(state.subst, type)),
  )
}

type State = { subst: Subst }

function infer(ctx: Ctx, state: State, exp: Exp): Type {
  switch (exp.kind) {
    case "Var": {
      const typeScheme = ctxFind(ctx, exp.name)
      if (!typeScheme) throw new Error(`[infer] undefined name: ${exp.name}`)
      return typeSchemeGen(typeScheme)
    }

    case "Apply": {
      const targetType = infer(ctx, state, exp.target)
      const argType = infer(ctx, state, exp.arg)
      const retType = typeVarGen()
      const effect = unifyType(targetType, Types.Arrow(argType, retType))
      const nextSubst = effect(state.subst)
      if (!nextSubst) throw new Error("[infer] fail on apply")
      state.subst = nextSubst
      return retType
    }

    case "Lambda": {
      const argType = typeVarGen()
      const retType = infer(ctxUpdate(ctx, exp.name, argType), state, exp.ret)
      return Types.Arrow(argType, retType)
    }

    case "Let": {
      const rhsType = infer(ctx, state, exp.rhs)
      const rhsTypeScheme = typeClosure(substOnCtx(state.subst, ctx), rhsType)
      const bodyCtx = ctxUpdate(ctx, exp.name, rhsTypeScheme)
      return infer(bodyCtx, state, exp.body)
    }
  }
}
