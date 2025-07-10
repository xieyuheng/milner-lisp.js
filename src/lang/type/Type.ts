import { globalFreshen } from "../../utils/globalFreshen.ts"
import { setDifference, setUnion, setUnionMany } from "../../utils/set/index.ts"
import { ctxFreeTypeNames, type Ctx } from "../ctx/index.ts"
import { substDeepWalk, substEmpty, substUpdate } from "../subst/index.ts"

export type Type = TypeVar | Datatype | Arrow
export type TypeVar = { kind: "TypeVar"; name: string }
export type Datatype = { kind: "Datatype"; name: string; args: Array<Type> }
export type Arrow = { kind: "Arrow"; argType: Type; retType: Type }

export function TypeVar(name: string): TypeVar {
  return { kind: "TypeVar", name }
}

export function Datatype(name: string, args: Array<Type>): Datatype {
  return { kind: "Datatype", name, args }
}

export function Arrow(argType: Type, retType: Type): Arrow {
  return { kind: "Arrow", argType, retType }
}

export type TypeScheme = Type | Nu
export type Nu = { kind: "Nu"; names: Array<string>; type: Type }

export function Nu(names: Array<string>, type: Type): Nu {
  return { kind: "Nu", names, type }
}

export function typeVarGen(): TypeVar {
  return TypeVar(globalFreshen("t"))
}

export function typeSchemeRefresh(typeScheme: TypeScheme): TypeScheme {
  if (typeScheme.kind === "Nu") {
    let freshNames = []
    let subst = substEmpty()
    for (const name of typeScheme.names) {
      const freshName = globalFreshen("t")
      freshNames.push(freshName)
      subst = substUpdate(subst, name, TypeVar(freshName))
    }

    return Nu(freshNames, substDeepWalk(subst, typeScheme.type))
  }

  return typeScheme
}

export function typeSchemeGen(typeScheme: TypeScheme): Type {
  typeScheme = typeSchemeRefresh(typeScheme)
  if (typeScheme.kind === "Nu") {
    return typeScheme.type
  }

  return typeScheme
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
  }
}

export function typeSchemeFreeNames(typeScheme: TypeScheme): Set<string> {
  if (typeScheme.kind === "Nu") {
    return setDifference(
      typeFreeNames(typeScheme.type),
      new Set(typeScheme.names),
    )
  }

  return typeFreeNames(typeScheme)
}

export function typeClosure(ctx: Ctx, type: Type): TypeScheme {
  const freeNames = setDifference(typeFreeNames(type), ctxFreeTypeNames(ctx))
  return Nu(Array.from(freeNames), type)
}
