import { type Env } from "../env/index.ts"
import { type Exp } from "../exp/index.ts"
import { type Mod } from "../mod/index.ts"
import { type Neutral } from "../neutral/index.ts"

export type Value = NotYet | Fn
export type NotYet = { kind: "NotYet"; neutral: Neutral }
export type Fn = { kind: "Fn"; mod: Mod; env: Env; name: string; ret: Exp }

export function NotYet(neutral: Neutral): NotYet {
  return {
    kind: "NotYet",
    neutral,
  }
}

export function Fn(mod: Mod, env: Env, name: string, ret: Exp): Fn {
  return {
    kind: "Fn",
    mod,
    env,
    name,
    ret,
  }
}
