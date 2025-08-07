(import "nat-church.lisp" zero add1 iter-Nat)
(import "nat-church.lisp" one two three four five six seven eight nine ten)

(import "nat-church.lisp" add)

(add two five) seven
(add three three) six

(import "nat-church.lisp" add-rosser)

(add-rosser two five) seven
(add-rosser three three) six

(import "nat-church.lisp" mul)

(mul two five) ten
(mul three three) nine
(add two two) (mul two two)

(mul two (mul two (mul two two)))
(mul (mul two two) (mul two two))

;; (import power-of power "nat-church.lisp")

;; (power two three) eight
;; (power three two) nine

;; (power two four)
;; (mul (mul two two) (mul two two))
;; (power four two)
;; (mul four four)

(import "bool.lisp" true false if and or not)

(import "nat-church.lisp" zero?)

(zero? zero) true
(zero? one) false
(zero? two) false

(import "nat-church.lisp" sub1)

(sub1 two) one
(sub1 one) zero
(sub1 zero) zero

(import "nat-church.lisp" sub)

(sub three zero) three
(sub three one) two
;; (sub three two) one
;; (sub three three) zero (sub three four)

(import "nat-church.lisp" lteq)

;; (lteq three four) true
;; (lteq four three) false
