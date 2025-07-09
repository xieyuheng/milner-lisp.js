import { stringToSubscript } from "../../utils/stringToSubscript.ts"
import type { Ctx } from "../ctx/index.ts"

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

let typeVarCount = 0

export function typeVarGen(): TypeVar {
  return TypeVar(stringToSubscript(`t${++typeVarCount}`))
}

export function typeSchemeGen(typeScheme: TypeScheme): Type {
  throw new Error()
}

export function typeClosure(ctx: Ctx, type: Type): TypeScheme {
  throw new Error()
}
