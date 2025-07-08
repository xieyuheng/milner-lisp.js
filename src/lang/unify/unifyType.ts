import { substExtend, type Subst } from "../subst/index.ts"
import type { Type } from "../type/index.ts"

export function unifyType(x: Type, y: Type, subst: Subst): Subst | undefined {
  // x = substWalk(subst, x)
  // y = substWalk(subst, y)

  if (x.kind === "TypeVar" && y.kind === "TypeVar" && x.name === y.name) {
    return subst
  }

  if (x.kind === "TypeVar") {
    return substExtend(subst, x.name, y)
  }

  if (y.kind === "TypeVar") {
    return substExtend(subst, y.name, x)
  }

  if (x.kind === "TypeConst" && y.kind === "TypeConst") {
    if (x.name === y.name) {
      return subst
    } else {
      return undefined
    }
  }

  if (x.kind === "Arrow" && y.kind === "Arrow") {
    const nextSubst = unifyType(x.argType, y.argType, subst)
    if (!nextSubst) return undefined
    return unifyType(x.retType, y.retType, nextSubst)
  }

  return undefined
}
