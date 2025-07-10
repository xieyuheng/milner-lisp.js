import { setUnionMany } from "../../utils/set/index.ts"
import { typeSchemeFreeNames, type TypeScheme } from "../type/index.ts"

export type Ctx = Map<string, TypeScheme>

export function ctxEmpty(): Ctx {
  return new Map()
}

export function ctxNames(ctx: Ctx): Array<string> {
  return Array.from(ctx.keys())
}

export function ctxTypeSchemes(ctx: Ctx): Array<TypeScheme> {
  return Array.from(ctx.values())
}

export function ctxFind(ctx: Ctx, name: string): undefined | TypeScheme {
  return ctx.get(name)
}

export function ctxUpdate(ctx: Ctx, name: string, typeScheme: TypeScheme): Ctx {
  return new Map([...ctx, [name, typeScheme]])
}

export function ctxFreeTypeNames(ctx: Ctx): Set<string> {
  return setUnionMany(ctxTypeSchemes(ctx).map(typeSchemeFreeNames))
}
