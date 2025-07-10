import { ctxEmpty, ctxUpdate, type Ctx } from "../ctx/index.ts"
import { type Def } from "../def/index.ts"
import { type Stmt } from "../stmt/index.ts"

export type Mod = {
  url: URL
  loadedMods: Map<string, { mod: Mod; text: string }>
  defs: Map<string, Def>
  stmts: Array<Stmt>
  isFinished?: boolean
}

export function modToCtx(mod: Mod): Ctx {
  let ctx = ctxEmpty()
  for (const [name, def] of mod.defs.entries()) {
    if (def.typeScheme) {
      ctx = ctxUpdate(ctx, name, def.typeScheme)
    }
  }

  return ctx
}
