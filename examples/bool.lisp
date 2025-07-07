(define (true t f) t)
(define (false t f) f)

(define (if p t f) (p t f))
(define (and x y) (if x y false))
(define (or x y) (if x true y))
(define (not x) (if x false true))

;; Tests

false
(and true false)
(not true)

true
(or true false)
(not (not true))
