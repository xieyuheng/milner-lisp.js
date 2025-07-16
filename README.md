# hindley-milner.js

To practics implementing Hindley-Milner type system.

## Examples

**[combinators.lisp](examples/combinators.lisp)**

```scheme
(define (S f g x) ((f x) (g x)))
(define (K x y) x)
(define (I x) x)
(define (C f x y) (f y x))
(define (B f g x) (f (g x)))
```

Inferred:

```scheme
(claim S (nu (A B C) (-> (-> A B C) (-> A B) A C)))
(claim K (nu (A B) (-> A B A)))
(claim I (nu (A) (-> A A)))
(claim C (nu (A B C) (-> (-> A B C) B A C)))
(claim B (nu (A B C) (-> (-> A B) (-> C A) C B)))
```

## Usages

### Command line tool

Install it by the following command:

```sh
npm install -g @cicada-lang/hindley-milner.js
```

The command-line program is called `hindley-milner.js`.

## Development

```sh
npm install
npm run build
npm run test
```

## Contributions

To make a contribution, fork this project and create a pull request.

Please read the [STYLE-GUIDE.md](STYLE-GUIDE.md) before you change the code.

Remember to add yourself to [AUTHORS](AUTHORS).
Your line belongs to you, you can write a little
introduction to yourself but not too long.

## License

[GPLv3](LICENSE)
