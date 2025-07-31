import { emptyEnv } from "../env/index.ts"
import { evaluate } from "../evaluate/index.ts"
import { formatType } from "../format/index.ts"
import { ctxFromMod } from "../infer/ctxFromMod.ts"
import { infer } from "../infer/index.ts"
import type { Mod } from "../mod/index.ts"
import { modDefine } from "../mod/index.ts"
import type { Stmt } from "../stmt/index.ts"

export async function handleDefine(mod: Mod, stmt: Stmt): Promise<void> {
  if (stmt.kind === "Define") {
    const ctx = ctxFromMod(mod)
    const type = infer(ctx, stmt.exp)
    console.log(`(claim ${stmt.name} ${formatType(type)})`)
    const value = evaluate(mod, emptyEnv(), stmt.exp)
    modDefine(mod, stmt.name, {
      mod,
      name: stmt.name,
      exp: stmt.exp,
      value,
      type: type,
    })

    return
  }
}
