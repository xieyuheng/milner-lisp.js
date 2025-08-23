import fs from "node:fs"
import { expFreeNames } from "../exp/index.ts"
import { formatExp } from "../format/index.ts"
import { createMod, modFind, modOwnDefs, type Mod } from "../mod/index.ts"
import { parseStmts } from "../parse/index.ts"
import { globalLoadedMods } from "./globalLoadedMods.ts"
import { handleDefine } from "./handleDefine.ts"
import { handleEffect } from "./handleEffect.ts"
import { handleImport } from "./handleImport.ts"

export async function load(url: URL): Promise<Mod> {
  const found = globalLoadedMods.get(url.href)
  if (found !== undefined) return found.mod

  const text = await fs.promises.readFile(url.pathname, "utf8")
  const mod = createMod(url)
  mod.stmts = parseStmts(text)

  globalLoadedMods.set(url.href, { mod, text })
  await run(mod)
  return mod
}

async function run(mod: Mod): Promise<void> {
  if (mod.isFinished) return

  // `handleImport` first means we can not support circular import.
  for (const stmt of mod.stmts) await handleImport(mod, stmt)
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
