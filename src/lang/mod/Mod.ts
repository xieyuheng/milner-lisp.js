import { ctxUpdate, emptyCtx, type Ctx } from "../ctx/index.ts"
import { type Exp } from "../exp/index.ts"
import { type Stmt } from "../stmt/index.ts"
import { type Type } from "../type/index.ts"
import { type Value } from "../value/index.ts"

export type Def = {
  mod: Mod
  name: string
  exp: Exp
  value: Value
  type?: Type
}

export type Mod = {
  url: URL
  loadedMods: Map<string, { mod: Mod; text: string }>
  defs: Map<string, Def>
  stmts: Array<Stmt>
  isFinished?: boolean
}

export function modToCtx(mod: Mod): Ctx {
  let ctx = emptyCtx()
  for (const [name, def] of mod.defs.entries()) {
    if (def.type) {
      ctx = ctxUpdate(ctx, name, def.type)
    }
  }

  return ctx
}
