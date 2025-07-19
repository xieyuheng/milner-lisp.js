import { type Mod } from "../mod/index.ts"
import { ctxUpdate, emptyCtx, type Ctx } from "./Ctx.ts"

export function ctxFromMod(mod: Mod): Ctx {
  let ctx = emptyCtx()
  for (const [name, def] of mod.defs.entries()) {
    if (def.type) {
      ctx = ctxUpdate(ctx, name, def.type)
    }
  }

  return ctx
}
