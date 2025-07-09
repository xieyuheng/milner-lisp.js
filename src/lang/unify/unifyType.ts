import { substUpdate, substWalk, type Subst } from "../subst/index.ts"
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
        return subst
      } else {
        return undefined
      }
    }

    if (x.kind === "Arrow" && y.kind === "Arrow") {
      const nextSubst = unifyType(x.argType, y.argType)(subst)
      if (!nextSubst) return undefined
      return unifyType(x.retType, y.retType)(nextSubst)
    }

    return undefined
  }
}
