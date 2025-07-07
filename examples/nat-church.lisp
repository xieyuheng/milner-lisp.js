(define zero (lambda (base step) base))
(define (add1 prev) (lambda (base step) (step (prev base step))))
(define (iter-Nat n base step) (n base step))

;; one to ten

(define one (add1 zero))
(define two (add1 one))
(define three (add1 two))
(define four (add1 three))
(define five (add1 four))
(define six (add1 five))
(define seven (add1 six))
(define eight (add1 seven))
(define nine (add1 eight))
(define ten (add1 nine))

(define (add m n) (iter-Nat m n add1))

;; The above `add` is `O(n)`,
;; Rosser has a `O(4)` `add`, which takes
;; four beta-reduction steps for any inputs
;; (assuming inputs are in normal forms).

(define (add-rosser m n)
  (lambda (base step)
    (iter-Nat m (iter-Nat n base step) step)))

(define (mul m n) (iter-Nat m zero (add n)))

(define (power-of m n) (iter-Nat m one (mul n)))
(define (power m n) (power-of n m))

(import true false if and or not "bool.lisp")

(define (zero? n) (iter-Nat n true (lambda (x) false)))

;; The `sub1` about is `O(n)`,
;; while `sub1` for Scott encoding is `O(3)`.

(import cons car cdr "cons.lisp")

(define (shift-add1 x)
  (cons (cdr x) (add1 (cdr x))))

(define (sub1 n)
  (car (iter-Nat n (cons zero zero) shift-add1)))

(define (sub m n) (iter-Nat n m sub1))

(define (lteq m n) (zero? (sub m n)))
