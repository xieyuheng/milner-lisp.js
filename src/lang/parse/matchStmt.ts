import * as X from "@xieyuheng/x-data.js"
import * as Exps from "../exp/index.ts"
import * as Stmts from "../stmt/index.ts"
import { type Stmt } from "../stmt/index.ts"
import { matchExp } from "./matchExp.ts"

const stmtMatcher: X.Matcher<Stmt> = X.matcherChoice<Stmt>([
  X.matcher("`(define ,(cons name args) ,exp)", ({ name, args, exp }) =>
    Stmts.Define(
      X.symbolToString(name),
      X.dataToArray(args)
        .map(X.symbolToString)
        .reduceRight((fn, name) => Exps.Lambda(name, fn), matchExp(exp)),
    ),
  ),

  X.matcher("`(define ,name ,exp)", ({ name, exp }) =>
    Stmts.Define(X.symbolToString(name), matchExp(exp)),
  ),

  X.matcher("(cons 'import body)", ({ body }) => {
    const array = X.dataToArray(body)
    const url = array[array.length - 1]
    const entries = array.slice(0, array.length - 1)
    return Stmts.Import(X.dataToString(url), entries.map(matchImportEntry))
  }),

  X.matcher("exp", ({ exp }) => Stmts.Compute(matchExp(exp))),
])

export function matchStmt(data: X.Data): Stmt {
  return X.match(stmtMatcher, data)
}

function matchImportEntry(data: X.Data): Stmts.ImportEntry {
  return X.match(
    X.matcherChoice([
      X.matcher("`(rename ,name ,rename)", ({ name, rename }) => ({
        name: X.symbolToString(name),
        rename: X.symbolToString(rename),
      })),

      X.matcher("name", ({ name }) => ({ name: X.symbolToString(name) })),
    ]),
    data,
  )
}
