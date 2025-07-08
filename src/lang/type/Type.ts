export type Type = TypeVar | TypeConst | Arrow
export type TypeVar = { kind: "TypeVar"; name: string }
export type TypeConst = { kind: "TypeConst"; name: string }
export type Arrow = { kind: "Arrow"; argType: Type; retType: Type }

export type TypeScheme = Type | Nu
export type Nu = { kind: "Nu"; names: Array<string>; type: Type }
