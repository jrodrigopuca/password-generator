# Password Generator

Generador de contraseñas memorables. Transforma una palabra común en una contraseña segura reemplazando caracteres por números, símbolos y mayúsculas. Por ejemplo: `determination` → `determ1n@tIon`.

[Firefox Extension](https://addons.mozilla.org/addon/memorable-passwords/) · [Web](https://yardev.net/pg)

---

## Descripción general

Este proyecto genera contraseñas fáciles de recordar a partir de palabras reales. El algoritmo:

1. Selecciona una palabra aleatoria (entre 8 y 15 caracteres) de un diccionario (inglés o español).
2. Reemplaza un carácter por un **símbolo** (`a→@`, `s→$`, `i→!`, etc.).
3. Reemplaza un carácter por un **número** (`a→4`, `e→3`, `i→1`, etc.).
4. Convierte un carácter a **mayúscula**.
5. Devuelve la palabra original y la contraseña generada.

**Resultado:** `{ original: "determination", pass: "determ1n@tIon" }`

---

## Estructura del repositorio

```
password-generator/
├── library/            ← Código fuente principal del generador
│   ├── src/
│   │   ├── generator.js    # Clase Generator (lógica principal)
│   │   ├── index.js         # Punto de entrada / exportación
│   │   ├── index.html       # HTML para desarrollo local
│   │   ├── wordsEN.json     # Diccionario de palabras en inglés
│   │   └── wordsES.json     # Diccionario de palabras en español
│   ├── package.json         # Dependencias y scripts (build, dev)
│   └── webpack.config.js    # Configuración de Webpack (genera generator.js minificado)
│
├── extension/          ← Extensión para Firefox
│   ├── manifest.json        # Manifiesto v2 para Firefox
│   ├── popup.html           # UI del popup (label + input + botones)
│   ├── popup.js             # Lógica del popup (generar, copiar)
│   ├── popup.css            # Estilos del popup
│   ├── generator.js         # Bundle minificado generado por Webpack
│   └── images/              # Iconos de la extensión
│
├── extensionEdge/      ← Extensión para Microsoft Edge
│   ├── manifest.json        # Manifiesto v2 adaptado para Edge
│   ├── popup.html / .js / .css  # Misma funcionalidad que Firefox
│   ├── generator.js         # Bundle minificado
│   └── images/              # Iconos adaptados para Edge
│
├── web/                ← Versión web independiente
│   ├── index.html           # Página web del generador
│   ├── pg.js                # Lógica de la página (generar, copiar, validar)
│   ├── generator.js         # Bundle minificado
│   └── style.css            # Estilos de la página web
│
├── LICENSE                  # Licencia GPL v3
└── README.md                # Este archivo
```

---

## Clase `Generator` — API

La clase `Generator` es el núcleo del proyecto. Se encuentra en [library/src/generator.js](library/src/generator.js).

### Constructor

```js
const gen = new Generator(lang);
```

| Parámetro | Tipo     | Default | Descripción                             |
| --------- | -------- | ------- | --------------------------------------- |
| `lang`    | `string` | `"EN"`  | Idioma del diccionario: `"EN"` o `"ES"` |

### Métodos

| Método                              | Descripción                                                                                                  |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `getPass()`                         | Genera y devuelve `{ original: string, pass: string }` con la palabra original y la contraseña.              |
| `getSymbol(text)`                   | Reemplaza un carácter de `text` por un símbolo (`@`, `$`, `!`, etc.).                                        |
| `getNumber(text)`                   | Reemplaza un carácter de `text` por un número (`4`, `3`, `1`, etc.).                                         |
| `getMayus(text)`                    | Convierte un carácter de `text` a mayúscula.                                                                 |
| `change(text, aOriginal, aChanged)` | Método genérico: busca un carácter de `text` en `aOriginal` y lo sustituye por su equivalente en `aChanged`. |
| `getWord(arr)`                      | Devuelve un elemento aleatorio de un array o un carácter aleatorio de un string.                             |

### Tablas de sustitución

**Símbolos:**

| Original | `a` | `c` | `d` | `i` | `l` | `o` | `p` | `s` | `y` | `q` |
| -------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Símbolo  | `@` | `(` | `)` | `!` | `/` | `*` | `?` | `$` | `&` | `¿` |

**Números:**

| Original | `a` | `b` | `e` | `i` | `g` | `o` | `q` | `s` | `t` | `z` |
| -------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Número   | `4` | `8` | `3` | `1` | `6` | `0` | `9` | `5` | `7` | `2` |

---

## Plataformas

### Extensión Firefox (`extension/`)

- **Manifest v2** — nombre: _Memorable Passwords_
- UI: popup con la palabra original, contraseña generada, botón copiar (📋) y botón regenerar (🔄)
- Publicada en [Firefox Add-ons](https://addons.mozilla.org/addon/memorable-passwords/)

### Extensión Edge (`extensionEdge/`)

- Misma funcionalidad que la extensión de Firefox
- `manifest.json` e imágenes adaptados para publicación en la tienda de Microsoft Edge

### Web (`web/`)

- Página web independiente en español
- Incluye validación de contraseña con regex (mínimo 8, máximo 15 caracteres, al menos una mayúscula, un número y un símbolo)
- Disponible en [yardev.net/pg](https://yardev.net/pg)

---

## Instalación y desarrollo

### Requisitos previos

- [Node.js](https://nodejs.org/)
- [Yarn](https://yarnpkg.com/)

### Compilar el bundle `generator.js`

```bash
cd library
yarn install
yarn build
```

Esto genera el archivo minificado en `library/dist/generator.js` usando Webpack + Babel. El bundle expone la clase `Generator` como variable global.

### Desarrollo local

```bash
cd library
yarn start:dev
```

Esto inicia `webpack-dev-server`. En la consola del navegador puedes probar:

```js
let gen = new Generator(); // Inglés por defecto
gen.getPass();
// → { original: "determination", pass: "determ1n@tIon" }

let genES = new Generator("ES"); // Español
genES.getPass();
// → { original: "encuentras", pass: "3ncu3ntr@S" }
```

### Instalar extensión en navegador (desarrollo)

1. Compila el bundle con `yarn build`
2. Copia `library/dist/generator.js` a la carpeta `extension/` o `extensionEdge/`
3. En el navegador:
   - **Firefox:** `about:debugging` → _Este Firefox_ → _Cargar complemento temporal_ → selecciona `extension/manifest.json`
   - **Edge:** `edge://extensions` → _Modo de desarrollador_ → _Cargar desempaquetada_ → selecciona la carpeta `extensionEdge/`

---

## Tecnologías

| Tecnología        | Uso                                               |
| ----------------- | ------------------------------------------------- |
| JavaScript ES6+   | Lógica del generador (clases, módulos)            |
| Webpack 4         | Bundling y minificación                           |
| Babel             | Transpilación para compatibilidad con navegadores |
| WebExtensions API | Extensiones de navegador (Manifest v2)            |

---

## Licencia

Este proyecto está licenciado bajo la [GNU General Public License v3](LICENSE).

## Instruction to test extension folder

just open popup.html in the browser
