(import zero add1 iter-Nat "nat-church.lisp")
(import one two three four five six seven eight nine ten "nat-church.lisp")

(import add "nat-church.lisp")

(add two five) seven
(add three three) six

(import add-rosser "nat-church.lisp")

(add-rosser two five) seven
(add-rosser three three) six

(import mul "nat-church.lisp")

(mul two five) ten
(mul three three) nine
(add two two) (mul two two)

(mul two (mul two (mul two two)))
(mul (mul two two) (mul two two))

(import power-of power "nat-church.lisp")

(power two three) eight
(power three two) nine

(power two four)
(mul (mul two two) (mul two two))
(power four two)
(mul four four)

(import true false if and or not "bool.lisp")

(import zero? "nat-church.lisp")

(zero? zero) true
(zero? one) false
(zero? two) false

(import sub1 "nat-church.lisp")

(sub1 two) one
(sub1 one) zero
(sub1 zero) zero

(import sub "nat-church.lisp")

(sub three zero) three
(sub three one) two
(sub three two) one
(sub three three) zero (sub three four)

(import lteq "nat-church.lisp")

(lteq three four) true
(lteq four three) false
