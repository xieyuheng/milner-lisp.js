import { expFreeNames } from "../exp/expFreeNames.ts"
import { formatTypeScheme } from "../format/index.ts"
import { inferTypeScheme } from "../infer/infer.ts"
import { modDefine, modToCtx } from "../mod/index.ts"
import type { Mod } from "../mod/Mod.ts"
import type { Stmt } from "../stmt/Stmt.ts"
import { importOne } from "./importOne.ts"

export function define(mod: Mod, stmt: Stmt): null {
  switch (stmt.kind) {
    case "Define": {
      const ctx = modToCtx(mod)
      const typeScheme = inferTypeScheme(ctx, stmt.exp)
      console.log(`(claim ${stmt.name} ${formatTypeScheme(typeScheme)})`)

      modDefine(mod, stmt.name, {
        mod,
        name: stmt.name,
        exp: stmt.exp,
        freeNames: expFreeNames(new Set(), stmt.exp),
        typeScheme,
      })

      return null
    }

    case "Import": {
      for (const entry of stmt.entries) {
        importOne(mod, stmt.path, entry)
      }

      return null
    }

    default: {
      return null
    }
  }
}
