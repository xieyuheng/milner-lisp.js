import { emptyEnv } from "../env/index.ts"
import { evaluate } from "../evaluate/index.ts"
import { formatExp, formatType } from "../format/index.ts"
import { ctxFromMod } from "../infer/ctxFromMod.ts"
import { infer } from "../infer/index.ts"
import { type Mod } from "../mod/index.ts"
import { readback } from "../readback/index.ts"
import type { Stmt } from "../stmt/index.ts"

export async function handleEffect(mod: Mod, stmt: Stmt): Promise<void> {
  if (stmt.kind === "Compute") {
    const ctx = ctxFromMod(mod)
    const type = infer(ctx, stmt.exp)
    const value = evaluate(mod, emptyEnv(), stmt.exp)
    const exp = readback(value)
    console.log(`(the ${formatType(type)} ${formatExp(exp)})`)
    return
  }
}
