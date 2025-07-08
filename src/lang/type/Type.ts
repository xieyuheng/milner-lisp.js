export type Type = TypeVar | TypeConst | Arrow
export type TypeVar = { kind: "TypeVar"; name: string }
export type TypeConst = { kind: "TypeConst"; name: string }
export type Arrow = { kind: "Arrow"; argType: Type; retType: Type }

export function TypeVar(name: string): TypeVar {
  return { kind: "TypeVar", name }
}

export function TypeConst(name: string): TypeConst {
  return { kind: "TypeConst", name }
}

export function Arrow(argType: Type, retType: Type): Arrow {
  return { kind: "Arrow", argType, retType }
}

export type TypeScheme = Type | Nu
export type Nu = { kind: "Nu"; names: Array<string>; type: Type }

export function Nu(names: Array<string>, type: Type): Nu {
  return { kind: "Nu", names, type }
}

export function typeSchemeGen(typeScheme: TypeScheme): Type {
  throw new Error()
}

export function typeVarGen(): TypeVar {
  throw new Error()
}
