import { globalFreshen } from "../../utils/globalFreshen.ts"
import type { Ctx } from "../ctx/index.ts"
import { substEmpty, substOnType, substUpdate } from "../subst/index.ts"

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

export function typeSchemeGen(typeScheme: TypeScheme): Type {
  if (typeScheme.kind === "Nu") {
    let subst = substEmpty()
    for (const name of typeScheme.names) {
      subst = substUpdate(subst, name, typeVarGen())
    }

    return substOnType(subst, typeScheme.type)
  }

  return typeScheme
}

export function typeClosure(ctx: Ctx, type: Type): TypeScheme {
  throw new Error()
}
