import {
  ctxFind,
  ctxNames,
  ctxUpdate,
  emptyCtx,
  type Ctx,
} from "../infer/Ctx.ts"
import * as Types from "../type/index.ts"
import { nuRefresh, type Type } from "../type/index.ts"

export type Subst = Map<string, Type>

export function emptySubst(): Subst {
  return new Map()
}

export function substNames(subst: Subst): Array<string> {
  return Array.from(subst.keys())
}

export function substTypes(subst: Subst): Array<Type> {
  return Array.from(subst.values())
}

export function substLength(subst: Subst): number {
  return subst.size
}

export function substEntries(subst: Subst): Array<[string, Type]> {
  return Array.from(subst.entries())
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

export function substDeepWalk(subst: Subst, type: Type): Type {
  type = substWalk(subst, type)

  switch (type.kind) {
    case "TypeVar": {
      return type
    }

    case "Datatype": {
      return Types.Datatype(
        type.name,
        type.args.map((arg) => substDeepWalk(subst, arg)),
      )
    }

    case "Arrow": {
      return Types.Arrow(
        substDeepWalk(subst, type.argType),
        substDeepWalk(subst, type.retType),
      )
    }

    case "Nu": {
      type = nuRefresh(type)
      return Types.Nu(type.names, substDeepWalk(subst, type.type))
    }
  }
}

export function substOnCtx(subst: Subst, ctx: Ctx): Ctx {
  let resultCtx = emptyCtx()
  for (const name of ctxNames(ctx)) {
    const type = ctxFind(ctx, name)
    if (!type) throw new Error("[substOnCtx] internal error")
    resultCtx = ctxUpdate(resultCtx, name, substDeepWalk(subst, type))
  }

  return resultCtx
}

export function substCompose(nextSubst: Subst, subst: Subst): Subst {
  let resultSubst = nextSubst
  for (const name of substNames(subst)) {
    const type = substFind(subst, name)
    if (!type) throw new Error("[substCompose] internal error")
    resultSubst = substUpdate(resultSubst, name, substDeepWalk(nextSubst, type))
  }

  return resultSubst
}

export function substComposeMany(substArray: Array<Subst>): Subst {
  return substArray.reduceRight(
    (resultSubst, subst) => substCompose(subst, resultSubst),
    emptySubst(),
  )
}
