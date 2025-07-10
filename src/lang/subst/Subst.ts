import {
  ctxEmpty,
  ctxFind,
  ctxNames,
  ctxUpdate,
  type Ctx,
} from "../ctx/index.ts"
import * as Types from "../type/index.ts"
import { type Type, type TypeScheme } from "../type/index.ts"

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

export function substUpdate(subst: Subst, name: string, type: Type): Subst {
  return new Map([...subst, [name, type]])
}

export function substDelete(subst: Subst, name: string): Subst {
  const map = new Map([...subst])
  map.delete(name)
  return map
}

export function substWalk(subst: Subst, type: Type): Type {
  while (type.kind === "TypeVar") {
    const found = substFind(subst, type.name)
    if (!found) return type
    type = found
  }

  return type
}

export function substOnType(subst: Subst, type: Type): Type {
  switch (type.kind) {
    case "TypeVar": {
      const found = substFind(subst, type.name)
      if (found) return found
      else return type
    }

    case "Datatype": {
      return Types.Datatype(
        type.name,
        type.args.map((arg) => substOnType(subst, arg)),
      )
    }

    case "Arrow": {
      return Types.Arrow(
        substOnType(subst, type.argType),
        substOnType(subst, type.retType),
      )
    }
  }
}

export function substOnTypeScheme(
  subst: Subst,
  typeScheme: TypeScheme,
): TypeScheme {
  throw new Error()
}

export function substOnCtx(subst: Subst, ctx: Ctx): Ctx {
  let newCtx = ctxEmpty()
  for (const name of ctxNames(ctx)) {
    const typeScheme = ctxFind(ctx, name)
    if (!typeScheme) throw new Error("[substOnCtx]")
    newCtx = ctxUpdate(newCtx, name, substOnTypeScheme(subst, typeScheme))
  }

  return newCtx
}

export function substCompose(nextSubst: Subst, subst: Subst): Subst {
  throw new Error()
}

export function substComposeMany(substArray: Array<Subst>): Subst {
  throw new Error()
}
