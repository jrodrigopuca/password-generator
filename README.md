# Password Generator

This tool transforms a simple word to password. It's useful to remember. For example: 'determination' turn to 'determ1n@tIon'.

[Firefox Extension](https://addons.mozilla.org/addon/memorable-passwords/)

[Web](https://yardev.net/pg)

-------------------------
## Extension folder: 
- popup.html: main html, just show: two buttons, a label and an input with read only.
- popup.js: main javascript file, use generator.js (minified file made with webpack). I include source code in 'library folder'.
- manifest.js
- images

## Library folder:
- dist: minified files 
- src
  - generator.js: First it selects a random word from a list of words, after that change a random character by a number and symbol and capital letter. Finally returns the original word and the password.
  - index.html: just to presentation
  - index.js: file to export generator.js
  - wordsEN: list of words on english
  - wordsES: list of words on spanish
- package.json
- webpack.config.js

-------------------------

## Instruction to generate 'generator.js' with library folder.
```
$ cd library
$ yarn install
$ yarn build
```

## Instruction to test generator.js
```
$ yarn start:dev
```
on web browser console type: 
```
let a = new Generator()
a.getPass() 
```
It returns a original word an pass like 
```
{original:"determination", pass:"determ1n@tIon"}
```

## Instruction to test extension folder
just open popup.html in the browser