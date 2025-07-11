import {
  substDeepWalk,
  substEmpty,
  substFind,
  substLength,
  substUpdate,
  type Subst,
} from "../subst/index.ts"
import * as Types from "../type/index.ts"
import { type Type, type TypeScheme } from "../type/index.ts"

export function reifyTypeScheme(typeScheme: TypeScheme): TypeScheme {
  if (typeScheme.kind !== "Nu") return typeScheme

  const renamingSubst = prepareSubst(
    typeScheme.names,
    typeScheme.type,
    substEmpty(),
  )

  const newNames = []
  for (const name of typeScheme.names) {
    const found = substFind(renamingSubst, name)
    if (!found) throw new Error()
    if (found.kind !== "TypeVar") throw new Error()
    newNames.push(found.name)
  }

  return Types.Nu(newNames, substDeepWalk(renamingSubst, typeScheme.type))
}

function prepareSubst(names: Array<string>, type: Type, subst: Subst): Subst {
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
        subst = prepareSubst(names, arg, subst)
      }

      return subst
    }

    case "Arrow": {
      subst = prepareSubst(names, type.argType, subst)
      subst = prepareSubst(names, type.retType, subst)
      return subst
    }
  }
}

function typeVarGenReadable(index: number): Types.TypeVar {
  return Types.TypeVar(index.toString())
}
