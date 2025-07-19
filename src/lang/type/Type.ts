import { globalFreshen } from "../../utils/name/globalFreshen.ts"
import { setDifference, setUnion, setUnionMany } from "../../utils/set/Set.ts"
import { ctxFreeTypeNames, type Ctx } from "../infer/Ctx.ts"
import { emptySubst, substDeepWalk, substUpdate } from "../subst/index.ts"

export type Type = TypeVar | Datatype | Arrow | Nu
export type TypeVar = { kind: "TypeVar"; name: string }
export type Datatype = { kind: "Datatype"; name: string; args: Array<Type> }
export type Arrow = { kind: "Arrow"; argType: Type; retType: Type }
export type Nu = { kind: "Nu"; names: Array<string>; type: Type }

export function TypeVar(name: string): TypeVar {
  return { kind: "TypeVar", name }
}

export function Datatype(name: string, args: Array<Type>): Datatype {
  return { kind: "Datatype", name, args }
}

export function Arrow(argType: Type, retType: Type): Arrow {
  return { kind: "Arrow", argType, retType }
}

export function Nu(names: Array<string>, type: Type): Nu {
  return { kind: "Nu", names, type }
}

export function createNuInCtx(ctx: Ctx, type: Type): Nu {
  const freeNames = setDifference(typeFreeNames(type), ctxFreeTypeNames(ctx))
  return Nu(Array.from(freeNames), type)
}

export function typeRemoveNu(type: Type): Type {
  if (type.kind === "Nu") {
    type = nuRefresh(type)
    return type.type
  }

  return type
}

export function nuRefresh(type: Nu): Nu {
  let freshNames = []
  let subst = emptySubst()
  for (const name of type.names) {
    const freshName = globalFreshen("t")
    freshNames.push(freshName)
    subst = substUpdate(subst, name, TypeVar(freshName))
  }

  return Nu(freshNames, substDeepWalk(subst, type.type))
}

export function typeVarGen(): TypeVar {
  return TypeVar(globalFreshen("t"))
}

export function typeFreeNames(type: Type): Set<string> {
  switch (type.kind) {
    case "TypeVar": {
      return new Set([type.name])
    }

    case "Datatype": {
      return setUnionMany(type.args.map(typeFreeNames))
    }

    case "Arrow": {
      return setUnion(typeFreeNames(type.argType), typeFreeNames(type.retType))
    }

    case "Nu": {
      return setDifference(typeFreeNames(type.type), new Set(type.names))
    }
  }
}
