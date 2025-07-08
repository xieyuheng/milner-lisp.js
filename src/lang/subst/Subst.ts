import { type Type } from "../type/index.ts"

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

export function substWalk(subst: Subst, type: Type): Type {
  while (type.kind === "TypeVar") {
    const found = substFind(subst, type.name)
    if (!found) return type
    type = found
  }

  return type
}
