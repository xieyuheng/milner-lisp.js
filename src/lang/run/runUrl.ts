import { load } from "./load.ts"
import { runMod } from "./runMod.ts"

export async function runUrl(url: URL): Promise<void> {
  const mod = await load(url, new Map())
  runMod(mod)
}
