import { type TypeScheme } from "../type/index.ts"

export type Ctx = Map<string, TypeScheme>

export function ctxEmpty(): Ctx {
  return new Map()
}

export function ctxNames(ctx: Ctx): Array<string> {
  return Array.from(ctx.keys())
}

export function ctxFind(ctx: Ctx, name: string): undefined | TypeScheme {
  return ctx.get(name)
}

export function ctxExtend(ctx: Ctx, name: string, typeScheme: TypeScheme): Ctx {
  return new Map([...ctx, [name, typeScheme]])
}
