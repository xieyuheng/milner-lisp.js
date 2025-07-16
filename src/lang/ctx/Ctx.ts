import { setUnionMany } from "../../utils/set/index.ts"
import { typeFreeNames, type Type } from "../type/index.ts"

export type Ctx = Map<string, Type>

export function emptyCtx(): Ctx {
  return new Map()
}

export function ctxNames(ctx: Ctx): Array<string> {
  return Array.from(ctx.keys())
}

export function ctxTypes(ctx: Ctx): Array<Type> {
  return Array.from(ctx.values())
}

export function ctxFind(ctx: Ctx, name: string): undefined | Type {
  return ctx.get(name)
}

export function ctxUpdate(ctx: Ctx, name: string, type: Type): Ctx {
  return new Map([...ctx, [name, type]])
}

export function ctxFreeTypeNames(ctx: Ctx): Set<string> {
  return setUnionMany(ctxTypes(ctx).map(typeFreeNames))
}
