import { type Type } from "../type/index.ts"

// Map from type-var to type.
export type Subst = Map<string, Type>

export function substEmpty(): Subst {
  return new Map()
}

export function substNames(subst: Subst): Array<string> {
  return Array.from(subst.keys())
}

export function substFind(subst: Subst, name: string): undefined | Type {
  return subst.get(name)
}

export function substExtend(subst: Subst, name: string, type: Type): Subst {
  return new Map([...subst, [name, type]])
}
