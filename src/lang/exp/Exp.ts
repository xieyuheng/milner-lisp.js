export type Exp = Var | Lambda | Apply | Let
export type Var = { kind: "Var"; name: string }
export type Apply = { kind: "Apply"; target: Exp; arg: Exp }
export type Lambda = { kind: "Lambda"; name: string; ret: Exp }
export type Let = { kind: "Let"; name: string; rhs: Exp; body: Exp }

export function Var(name: string): Var {
  return { kind: "Var", name }
}

export function Apply(target: Exp, arg: Exp): Apply {
  return { kind: "Apply", target, arg }
}

export function Lambda(name: string, ret: Exp): Lambda {
  return { kind: "Lambda", name, ret }
}

export function Let(name: string, rhs: Exp, body: Exp): Let {
  return { kind: "Let", name, rhs, body }
}
