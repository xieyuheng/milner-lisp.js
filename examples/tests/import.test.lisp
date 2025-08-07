(import "compose.lisp" id compose (rename compose c))

(compose
 (compose id id)
 (compose id id))
(c (c id id) (c id id))
id
