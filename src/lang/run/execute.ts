import { emptyEnv } from "../env/index.ts"
import { evaluate } from "../evaluate/index.ts"
import { formatExp, formatTypeScheme } from "../format/index.ts"
import { inferTypeScheme } from "../infer/index.ts"
import { modToCtx, type Mod } from "../mod/index.ts"
import { readback } from "../readback/index.ts"
import type { Stmt } from "../stmt/Stmt.ts"

export function execute(mod: Mod, stmt: Stmt): null {
  switch (stmt.kind) {
    case "Compute": {
      const ctx = modToCtx(mod)
      const typeScheme = inferTypeScheme(ctx, stmt.exp)

      const value = evaluate(mod, emptyEnv(), stmt.exp)
      const exp = readback({ usedNames: new Set() }, value)

      console.log(`(the ${formatTypeScheme(typeScheme)} ${formatExp(exp)})`)

      return null
    }

    default: {
      return null
    }
  }
}
