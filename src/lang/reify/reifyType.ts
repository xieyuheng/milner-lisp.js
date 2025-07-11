import {
  substDeepWalk,
  substEmpty,
  substFind,
  substLength,
  substUpdate,
  type Subst,
} from "../subst/index.ts"
import { TypeVar, type Type } from "../type/index.ts"

export function reifyType(type: Type): Type {
  const substForRenaming = prepareSubst(type, substEmpty())
  return substDeepWalk(substForRenaming, type)
}

function prepareSubst(type: Type, subst: Subst): Subst {
  switch (type.kind) {
    case "TypeVar": {
      const found = substFind(subst, type.name)
      if (found) {
        return subst
      } else {
        return substUpdate(
          subst,
          type.name,
          typeVarGenReadable(substLength(subst)),
        )
      }
    }

    case "Datatype": {
      for (const arg of type.args) {
        subst = prepareSubst(arg, subst)
      }

      return subst
    }

    case "Arrow": {
      subst = prepareSubst(type.argType, subst)
      subst = prepareSubst(type.retType, subst)
      return subst
    }
  }
}

function typeVarGenReadable(index: number): TypeVar {
  return TypeVar(index.toString())
}
