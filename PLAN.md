# Memorable Passwords v2 — Plan de desarrollo

> **Estado**: ✅ Implementación completa — todas las fases del roadmap finalizadas.

## Visión

Reescribir el generador de contraseñas memorables desde cero con una arquitectura moderna, tipada y mantenible. Un solo codebase que alimente:

- **Memorable Passwords** — extensión de navegador universal (Chrome, Edge, Firefox)
- **`@memorable-passwords/core`** — librería npm publicable para que cualquier proyecto genere contraseñas memorables
- **Web / CLI** — consumidores futuros de la misma librería

---

## Problemas del código legacy (resueltos ✅)

| Problema                      | Impacto                                                                                                              | Solución v2                                                |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| Manifest v2                   | Chrome/Edge ya no aceptan extensiones nuevas con v2; Firefox lo deprecará                                            | ✅ Manifest v3 universal                                   |
| Código duplicado              | `extension/`, `extensionEdge/` y `web/` contienen copias del bundle y lógica casi idéntica                           | ✅ Monorepo con paquete `core` compartido                  |
| Diccionario de baja calidad   | Listas JSON enormes con nombres propios, marcas, términos técnicos y palabras que no producen contraseñas memorables | ✅ 1 807 EN + 1 656 ES palabras curadas (6-12 chars)       |
| Una sola sustitución por tipo | Solo 1 símbolo, 1 número y 1 mayúscula — puede no pasar validaciones estrictas                                       | ✅ Cantidad configurable de símbolos, números y mayúsculas |
| `Math.random()`               | No es criptográficamente seguro                                                                                      | ✅ `crypto.getRandomValues()` en todos los módulos         |
| Sin tests ni tipos            | No hay forma de verificar que los cambios no rompan nada                                                             | ✅ TypeScript estricto + 30 tests con Vitest               |
| Stack desactualizado          | Webpack 4, Babel 7 antiguo, sin TypeScript                                                                           | ✅ Vite 7 + TypeScript 5.9 + pnpm workspaces               |

---

## Estructura actual

```
password-generator/
├── packages/
│   ├── core/                        ← @memorable-passwords/core (librería npm)
│   │   ├── src/
│   │   │   ├── types.ts                 # GeneratorOptions, GeneratedPassword, defaults
│   │   │   ├── random.ts               # Wrapper sobre crypto.getRandomValues()
│   │   │   ├── transforms.ts           # removeDiacritics, applySymbols/Numbers/Uppercase
│   │   │   ├── strength.ts             # Cálculo de entropía y nivel de fortaleza
│   │   │   ├── generator.ts            # generate() — punto de entrada principal
│   │   │   ├── index.ts                # Re-exports públicos
│   │   │   └── dictionaries/
│   │   │       ├── en.ts               # 1 807 palabras inglés curadas
│   │   │       └── es.ts               # 1 656 palabras español curadas
│   │   ├── __tests__/
│   │   │   ├── generator.test.ts        # 14 tests
│   │   │   ├── transforms.test.ts       # 8 tests
│   │   │   └── random.test.ts           # 8 tests
│   │   ├── tsconfig.json
│   │   ├── vite.config.ts
│   │   └── package.json
│   │
│   └── extension/                   ← "Memorable Passwords" — extensión unificada
│       ├── manifest.json                # Manifest v3 (Chrome/Edge/Firefox)
│       ├── icons/
│       │   └── icon.svg                 # Icono SVG maestro (gradiente púrpura, llave, sparkles)
│       ├── public/icons/                # PNGs generados (16, 48, 128 px)
│       ├── src/
│       │   ├── background.ts            # Service worker (Manifest v3)
│       │   └── popup/
│       │       ├── popup.html           # UI con atributos data-i18n, ARIA, opciones avanzadas
│       │       ├── popup.ts             # Lógica: generación, historial, toast, preferencias
│       │       ├── popup.css            # Design system con CSS custom properties + dark mode
│       │       └── i18n.ts              # Traducciones EN/ES, applyI18n(), t()
│       ├── vite.config.ts
│       ├── tsconfig.json
│       └── package.json
│
├── demo/                            ← Demo visual standalone (Vite)
│   ├── index.html                       # Wrapper con device frame
│   ├── popup.html                       # Popup standalone con SVG inline
│   └── demo.ts                          # Lógica demo importando core + i18n
│
├── scripts/
│   └── generate-icons.mjs               # SVG → PNG con sharp (16/48/128)
│
├── legacy/                          ← Código anterior (referencia)
│
├── .github/
│   └── workflows/
│       └── ci.yml                       # Lint + tests en push/PR (Node 20 + 22)
│
├── package.json                     ← Root del monorepo (pnpm workspaces)
├── pnpm-workspace.yaml
├── tsconfig.base.json               # Config base TypeScript (ES2022, strict, bundler)
├── tsconfig.json                    # Referencias a core y extension
├── vitest.config.ts                 # Tests desde packages/core/__tests__
├── vite.demo.config.ts              # Config Vite para demo (puerto 3000)
├── LICENSE
├── README.md
└── PLAN.md                          ← Este archivo
```

---

## Stack tecnológico

| Herramienta                   | Versión | Rol                | Justificación                                                     |
| ----------------------------- | ------- | ------------------ | ----------------------------------------------------------------- |
| **pnpm workspaces**           | 10.x    | Monorepo           | Un solo `pnpm install`, dependencias compartidas, sin duplicación |
| **TypeScript**                | 5.9     | Lenguaje           | Tipos estrictos, autocompletado, errores en compilación           |
| **Vite**                      | 7.3     | Bundler            | Rápido, soporte nativo TS, HMR, modo library para core            |
| **vite-plugin-web-extension** | —       | Build de extensión | Genera extensión desde Vite, output para Manifest v3              |
| **vite-plugin-dts**           | 4.5     | Tipos de librería  | Genera `.d.ts` para el paquete core                               |
| **Vitest**                    | 4.0     | Tests              | 30 tests, rápido, compatible con Vite, API tipo Jest              |
| **sharp**                     | 0.34    | Iconos             | Renderiza SVG maestro a PNGs en múltiples tamaños                 |
| **GitHub Actions**            | —       | CI/CD              | Lint + tests automáticos en Node 20 y 22, matrix build            |

---

## Roadmap

### Fase 1 — Scaffolding ✅

- [x] Inicializar monorepo con pnpm workspaces
- [x] Configurar TypeScript base (`tsconfig.base.json`) — ES2022, strict, bundler resolution
- [x] Crear `packages/core/` con `package.json` y `tsconfig.json`
- [x] Crear `packages/extension/` con `package.json` y `tsconfig.json`
- [x] Configurar Vite para `core` (modo library con dual ESM/CJS)
- [x] Configurar Vitest
- [x] Agregar scripts en root: `build`, `build:core`, `build:extension`, `test`, `test:watch`, `dev`, `demo`, `lint`, `icons`

### Fase 2 — Core: generador ✅

- [x] Implementar `random.ts` — `randomInt()`, `randomElement()`, `randomChar()`, `shuffle()` sobre `crypto.getRandomValues()`
- [x] Implementar `types.ts` — `GeneratorOptions`, `GeneratedPassword`, `GenerationMode`, `Language`, `StrengthLevel`, `DEFAULT_OPTIONS`
- [x] Implementar `transforms.ts` — `removeDiacritics()`, `applySymbols()`, `applyNumbers()`, `applyUppercase()` con cantidades configurables
- [x] Curar diccionarios:
  - [x] EN: 1 807 palabras curadas (6-12 chars, sin nombres propios/marcas/ofensivas)
  - [x] ES: 1 656 palabras curadas con los mismos criterios
- [x] Implementar `generator.ts`:
  - [x] Modo **word** — palabra transformada con sustituciones configurables
  - [x] Modo **passphrase** — 3-4 palabras separadas por símbolo
  - [x] Modo **random** — caracteres aleatorios criptográficamente seguros
- [x] Implementar `strength.ts` — cálculo de entropía (bits) y niveles (`weak` / `fair` / `strong` / `very-strong`)
- [x] Escribir tests unitarios — 30 tests (14 generator + 8 transforms + 8 random)
- [x] Exportar API pública desde `index.ts`

### Fase 3 — Extensión de navegador ✅

- [x] Crear `manifest.json` v3 (Chrome/Edge/Firefox con `browser_specific_settings`)
- [x] Configurar Vite con `vite-plugin-web-extension`
- [x] Diseñar popup UI:
  - [x] Contraseña generada con botón copiar (acción principal prominente)
  - [x] Selector de modo (word / passphrase / random)
  - [x] Selector de idioma (EN / ES)
  - [x] Barra de fortaleza visual con entropía en bits
  - [x] Botón regenerar
  - [x] Opciones avanzadas colapsables (largo, cantidad de sustituciones)
- [x] Implementar `popup.ts` consumiendo `@memorable-passwords/core`
- [x] Implementar `background.ts` (service worker)
- [x] Guardar preferencias del usuario con `chrome.storage.local`
- [x] Diseñar iconos — SVG maestro (gradiente púrpura #9c5fff→#512da8, llave, sparkles dorados) + PNGs generados con sharp

### Fase 4 — Polish y UX ✅

- [x] Design system con CSS custom properties (`--mp-*` tokens) derivados de la paleta del icono
- [x] Tema claro/oscuro automático (`@media (prefers-color-scheme: dark)`)
- [x] Accesibilidad — ARIA labels, `role`, `aria-live`, `focus-visible`, navegación por teclado
- [x] Historial de contraseñas (últimas 25 en memoria de sesión, sin persistencia)
- [x] Toast al copiar ("Copied!" / "¡Copiado!")
- [x] i18n completo — toda la interfaz se traduce al cambiar idioma (EN/ES) vía `data-i18n` attributes
- [x] Demo visual standalone (`demo/`) con Vite en puerto 3000
- [x] Paneles colapsables con animación (opciones avanzadas, historial)

### Fase 5 — CI/CD y distribución ✅

- [x] GitHub Actions: CI (lint + tests en cada push/PR) — matrix Node 20 + 22
- [x] Actualizar README.md con documentación completa del proyecto v2
- [x] GitHub Actions: workflow manual (`release.yml`) para build de extensión (.zip) como artefacto — Chrome/Edge y Firefox por separado
- [ ] Documentar proceso de publicación en stores — _pendiente_:
  - [ ] Chrome Web Store
  - [ ] Firefox Add-ons (AMO)
  - [ ] Microsoft Edge Add-ons

---

## Consideraciones

### Seguridad (implementado ✅)

- **`crypto.getRandomValues()`** en lugar de `Math.random()` en todos los módulos de aleatoriedad (`random.ts`).
- **No se persisten contraseñas** en storage del navegador. El historial de sesión (máx. 25) se mantiene solo en memoria y se elimina al cerrar el popup.
- **Content Security Policy (CSP)** estricta en el manifest.json — sin `unsafe-eval` ni `unsafe-inline`.
- **Permisos mínimos** en la extensión: solo `storage`. Sin acceso a pestañas, historial ni datos de navegación.

### Diccionarios (implementado ✅)

- **EN**: 1 807 palabras curadas de uso cotidiano, pronunciables, 6-12 caracteres.
- **ES**: 1 656 palabras curadas con los mismos criterios.
- Sin nombres propios, marcas registradas ni contenido ofensivo.
- Cada diccionario exporta un array tipado desde `dictionaries/en.ts` y `dictionaries/es.ts`.

### Compatibilidad de extensión (implementado ✅)

- **Manifest v3** universal con un solo `manifest.json`.
- Firefox: incluye `browser_specific_settings` con gecko ID.
- Chrome/Edge: service worker como background script.
- `vite-plugin-web-extension` genera el build desde Vite.

### UX de la extensión (implementado ✅)

- El popup carga y genera una contraseña inmediatamente.
- **Copiar con un clic** es la acción más prominente.
- Las opciones avanzadas están en un panel colapsable para no abrumar al usuario casual.
- Las preferencias (modo, idioma, largo, sustituciones) se guardan con `chrome.storage.local`.
- **i18n**: toda la interfaz se traduce dinámicamente al cambiar el selector de idioma.

### Escalabilidad del core (implementado ✅)

- El paquete se publica como `@memorable-passwords/core` con dual ESM/CJS exports.
- La arquitectura con `GeneratorOptions` permite agregar:
  - Nuevos idiomas (solo agregar un archivo `dictionaries/fr.ts` y registrarlo en `generator.ts`).
  - Nuevas transformaciones.
  - Nuevos modos de generación.
- Tree-shakeable: Vite en modo library.
- El nombre de la extensión en los stores es **Memorable Passwords** — se mantiene por continuidad con la versión ya publicada en Firefox Add-ons.

---

## Ideas futuras

### Corto plazo (post-lanzamiento)

- **Release workflow**: GitHub Action para build automático de `.zip` y publicación como artefacto/release
- **Documentación de stores**: guía paso a paso para publicar en Chrome Web Store, Firefox AMO y Edge Add-ons
- **Keyboard shortcut global**: generar y copiar contraseña sin abrir el popup (ej. `Ctrl+Shift+P`)
- **Context menu**: click derecho en un campo de contraseña → "Generar contraseña memorable"
- **Autofill**: insertar la contraseña directamente en el campo activo de la página
- **Más idiomas**: francés, portugués, alemán, italiano
- **Palabras temáticas**: categorías opcionales (animales, comida, naturaleza, etc.) para contraseñas más divertidas

### Mediano plazo

- **Web app independiente**: desplegar en yardev.net/pg con la misma librería core, framework ligero (Astro, vanilla)
- **CLI tool**: `npx @memorable-passwords/core` para generar contraseñas desde la terminal
- **Publicar en npm**: publicar la librería core como paquete para que otros proyectos lo usen
- **Patrones personalizados**: el usuario define un template como `Ww-Nnnn-Ss` (W=palabra, N=número, S=símbolo)
- **Reglas de sitio**: presets para sitios conocidos que tienen reglas específicas (largo máximo, caracteres prohibidos, etc.)

### Largo plazo

- **Passphrase con separadores configurables**: `tiger.Boat.3lamp`, `tiger-Boat-3lamp`, `tiger Boat 3lamp`
- **Modo diceware**: generación basada en dados/entropía visual para usuarios avanzados
- **Integración con gestores de contraseñas**: exportar en formato compatible con Bitwarden/1Password
- **Estadísticas de uso**: cuántas contraseñas generadas (local, sin telemetría)
- **Soporte offline completo**: la extensión funciona sin conexión (ya lo hace, pero documentarlo como feature)
- **PWA**: versión web instalable como app
