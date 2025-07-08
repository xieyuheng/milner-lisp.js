import { type Subst } from "../exp/index.ts"

export type Exp = Var | Fn | Ap | Let
export type Var = { kind: "Var"; name: string }
export type Fn = { kind: "Fn"; name: string; ret: Exp }
export type Ap = { kind: "Ap"; target: Exp; arg: Exp }
export type Let = { kind: "Let"; subst: Subst; body: Exp }

export function Var(name: string): Var {
  return { kind: "Var", name }
}

export function Fn(name: string, ret: Exp): Fn {
  return { kind: "Fn", name, ret }
}

export function Ap(target: Exp, arg: Exp): Ap {
  return { kind: "Ap", target, arg }
}

export function Let(subst: Subst, body: Exp): Let {
  return { kind: "Let", subst, body }
}
