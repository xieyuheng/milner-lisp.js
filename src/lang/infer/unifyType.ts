import { arrayZip } from "../../utils/array/arrayZip.ts"
import { substUpdate, substWalk, type Subst } from "../infer/index.ts"
import type { Type } from "../type/index.ts"

export type SubstEffect = (subst: Subst) => Subst | undefined

export function unifyType(x: Type, y: Type): SubstEffect {
  return (subst) => {
    x = substWalk(subst, x)
    y = substWalk(subst, y)

    if (x.kind === "TypeVar" && y.kind === "TypeVar" && x.name === y.name) {
      return subst
    }

    if (x.kind === "TypeVar") {
      return substUpdate(subst, x.name, y)
    }

    if (y.kind === "TypeVar") {
      return substUpdate(subst, y.name, x)
    }

    if (x.kind === "Datatype" && y.kind === "Datatype") {
      if (x.name === y.name && x.args.length === y.args.length) {
        return effectSequence(
          arrayZip(x.args, y.args).map(([x, y]) => unifyType(x, y)),
        )(subst)
      } else {
        return undefined
      }
    }

    if (x.kind === "Arrow" && y.kind === "Arrow") {
      return effectSequence([
        unifyType(x.argType, y.argType),
        unifyType(x.retType, y.retType),
      ])(subst)
    }

    return undefined
  }
}

// combinators

export function effectSequence(effects: Array<SubstEffect>): SubstEffect {
  return (subst) => {
    for (const effect of effects) {
      const newSubst = effect(subst)
      if (!newSubst) return
      subst = newSubst
    }

    return subst
  }
}
