import { ctxFind, ctxUpdate, type Ctx } from "./Ctx.ts"
import type { Exp } from "../exp/index.ts"
import { reifyType } from "../reify/reifyType.ts"
import {
  emptySubst,
  substDeepWalk,
  substOnCtx,
  type Subst,
} from "../subst/index.ts"
import * as Types from "../type/index.ts"
import {
  createNuInCtx,
  typeRemoveNu,
  typeVarGen,
  type Type,
} from "../type/index.ts"
import { unifyType } from "./unifyType.ts"

export function infer(ctx: Ctx, exp: Exp): Type {
  const state = { subst: emptySubst() }
  const type = inferring(ctx, state, exp)
  return reifyType(
    createNuInCtx(
      substOnCtx(state.subst, ctx),
      substDeepWalk(state.subst, type),
    ),
  )
}

type State = { subst: Subst }

function inferring(ctx: Ctx, state: State, exp: Exp): Type {
  switch (exp.kind) {
    case "Var": {
      const type = ctxFind(ctx, exp.name)
      if (!type) throw new Error(`[infer] undefined name: ${exp.name}`)
      return typeRemoveNu(type)
    }

    case "Apply": {
      const targetType = inferring(ctx, state, exp.target)
      const argType = inferring(ctx, state, exp.arg)
      const retType = typeVarGen()
      const effect = unifyType(targetType, Types.Arrow(argType, retType))
      const nextSubst = effect(state.subst)
      if (!nextSubst) throw new Error("[infer] fail on apply")
      state.subst = nextSubst
      return retType
    }

    case "Lambda": {
      const argType = typeVarGen()
      const retType = inferring(
        ctxUpdate(ctx, exp.name, argType),
        state,
        exp.ret,
      )
      return Types.Arrow(argType, retType)
    }

    case "Let": {
      const rhsType = inferring(ctx, state, exp.rhs)
      const rhsNu = createNuInCtx(substOnCtx(state.subst, ctx), rhsType)
      const bodyCtx = ctxUpdate(ctx, exp.name, rhsNu)
      return inferring(bodyCtx, state, exp.body)
    }
  }
}
