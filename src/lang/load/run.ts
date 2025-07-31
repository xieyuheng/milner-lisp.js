import { expFreeNames } from "../exp/index.ts"
import { formatExp } from "../format/index.ts"
import { modFind, modOwnDefs, type Mod } from "../mod/index.ts"
import { handleDefine } from "./handleDefine.ts"
import { handleEffect } from "./handleEffect.ts"

export async function run(mod: Mod): Promise<void> {
  if (mod.isFinished) return

  for (const stmt of mod.stmts) await handleDefine(mod, stmt)

  postprocess(mod)

  for (const stmt of mod.stmts) await handleEffect(mod, stmt)

  mod.isFinished = true
}

function postprocess(mod: Mod): void {
  for (const def of modOwnDefs(mod).values()) {
    const freeNames = expFreeNames(new Set(), def.exp)
    for (const name of freeNames) {
      if (modFind(mod, name) === undefined) {
        throw new Error(
          [
            `[run] I find undefined name: ${name}`,
            `  defining: ${def.name}`,
            `  body: ${formatExp(def.exp)}`,
          ].join("\n"),
        )
      }
    }
  }
}
