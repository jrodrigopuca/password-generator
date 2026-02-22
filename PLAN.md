# Memorable Passwords v2 — Plan de desarrollo

## Visión

Reescribir el generador de contraseñas memorables desde cero con una arquitectura moderna, tipada y mantenible. Un solo codebase que alimente:

- **Memorable Passwords** — extensión de navegador universal (Chrome, Edge, Firefox)
- **Librería npm** — paquete publicable para que cualquier proyecto genere contraseñas memorables (nombre del paquete por definir)
- **Web / CLI** — consumidores futuros de la misma librería

---

## Problemas del código legacy

| Problema                      | Impacto                                                                                                              |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Manifest v2                   | Chrome/Edge ya no aceptan extensiones nuevas con v2; Firefox lo deprecará                                            |
| Código duplicado              | `extension/`, `extensionEdge/` y `web/` contienen copias del bundle y lógica casi idéntica                           |
| Diccionario de baja calidad   | Listas JSON enormes con nombres propios, marcas, términos técnicos y palabras que no producen contraseñas memorables |
| Una sola sustitución por tipo | Solo 1 símbolo, 1 número y 1 mayúscula — puede no pasar validaciones estrictas                                       |
| `Math.random()`               | No es criptográficamente seguro                                                                                      |
| Sin tests ni tipos            | No hay forma de verificar que los cambios no rompan nada                                                             |
| Stack desactualizado          | Webpack 4, Babel 7 antiguo, sin TypeScript                                                                           |

---

## Estructura propuesta

```
password-generator/
├── packages/
│   ├── core/                        ← Librería del generador (paquete npm, nombre TBD)
│   │   ├── src/
│   │   │   ├── generator.ts             # Clase principal
│   │   │   ├── dictionaries/
│   │   │   │   ├── en.ts                # Diccionario inglés curado
│   │   │   │   └── es.ts                # Diccionario español curado
│   │   │   ├── transforms.ts           # Sustituciones (símbolo, número, mayúscula)
│   │   │   ├── random.ts               # Wrapper sobre crypto.getRandomValues()
│   │   │   ├── strength.ts             # Cálculo de entropía / fortaleza
│   │   │   ├── types.ts                # Interfaces y tipos compartidos
│   │   │   └── index.ts                # Exports públicos
│   │   ├── __tests__/
│   │   │   ├── generator.test.ts
│   │   │   ├── transforms.test.ts
│   │   │   └── random.test.ts
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   └── extension/                   ← "Memorable Passwords" — extensión unificada (Chrome/Edge/Firefox)
│       ├── src/
│       │   ├── popup/
│       │   │   ├── popup.html
│       │   │   ├── popup.ts             # Lógica del popup
│       │   │   └── popup.css
│       │   ├── background.ts            # Service worker (Manifest v3)
│       │   └── manifest.json            # Manifest v3 universal
│       ├── icons/
│       ├── tsconfig.json
│       └── package.json
│
├── legacy/                          ← Código anterior (referencia)
├── package.json                     ← Root del monorepo (pnpm workspaces)
├── tsconfig.base.json               # Config base de TypeScript
├── vitest.config.ts                 # Configuración de tests
├── .github/
│   └── workflows/
│       ├── ci.yml                   # Lint + tests en cada PR
│       └── release.yml              # Build + empaquetado de extensión
├── LICENSE
├── README.md
└── PLAN.md                          ← Este archivo
```

---

## Stack tecnológico

| Herramienta                           | Rol                | Justificación                                                           |
| ------------------------------------- | ------------------ | ----------------------------------------------------------------------- |
| **pnpm workspaces**                   | Monorepo           | Un solo `pnpm install`, dependencias compartidas, sin duplicación       |
| **TypeScript**                        | Lenguaje           | Tipos, autocompletado, errores en compilación                           |
| **Vite**                              | Bundler            | Rápido, soporte nativo TS, HMR, plugins para extensiones                |
| **CRXJS / vite-plugin-web-extension** | Build de extensión | Genera extensión desde Vite, HMR en desarrollo, output para Manifest v3 |
| **Vitest**                            | Tests              | Rápido, compatible con Vite, API tipo Jest                              |
| **GitHub Actions**                    | CI/CD              | Lint + tests automáticos, build de extensión como artefacto             |

---

## Roadmap

### Fase 1 — Scaffolding (semana 1)

- [ ] Inicializar monorepo con pnpm workspaces
- [ ] Configurar TypeScript base (`tsconfig.base.json`)
- [ ] Crear `packages/core/` con `package.json` y `tsconfig.json`
- [ ] Crear `packages/extension/` con `package.json` y `tsconfig.json`
- [ ] Configurar Vite para `core` (modo library)
- [ ] Configurar Vitest
- [ ] Agregar scripts en root: `build`, `test`, `dev`

### Fase 2 — Core: generador (semana 2-3)

- [ ] Implementar `random.ts` — wrapper sobre `crypto.getRandomValues()`
- [ ] Implementar `types.ts` — interfaces (`GeneratorOptions`, `GeneratedPassword`, etc.)
- [ ] Implementar `transforms.ts` — tablas de sustitución configurables (símbolo, número, mayúscula)
- [ ] Curar diccionarios:
  - [ ] EN: filtrar [google-10000-english](https://github.com/first20hours/google-10000-english) → ~2,000 palabras (6-12 chars, sin nombres propios/marcas/ofensivas)
  - [ ] ES: filtrar lista de frecuencia similar → ~2,000 palabras
- [ ] Implementar `generator.ts`:
  - [ ] Modo **palabra transformada** (mejora del actual)
  - [ ] Modo **passphrase** (3-4 palabras separadas por símbolo)
  - [ ] Modo **aleatorio** (caracteres random)
- [ ] Implementar `strength.ts` — cálculo de entropía y nivel de fortaleza
- [ ] Escribir tests unitarios para cada módulo
- [ ] Exportar API pública desde `index.ts`

### Fase 3 — Extensión de navegador (semana 4-5)

- [ ] Crear `manifest.json` v3 (compatible Chrome/Edge/Firefox)
- [ ] Configurar Vite con plugin de extensión
- [ ] Diseñar popup UI:
  - [ ] Contraseña generada con botón copiar
  - [ ] Selector de modo (palabra / passphrase / random)
  - [ ] Selector de idioma
  - [ ] Barra de fortaleza visual
  - [ ] Botón regenerar
  - [ ] Opciones rápidas (largo, cantidad de sustituciones)
- [ ] Implementar `popup.ts` consumiendo el paquete `core`
- [ ] Implementar `background.ts` (service worker) si se necesita persistencia
- [ ] Guardar preferencias del usuario con `chrome.storage.local`
- [ ] Probar en Chrome, Edge y Firefox

### Fase 4 — Polish y UX (semana 6)

- [ ] Animaciones y transiciones en el popup
- [ ] Tema claro/oscuro (respetando preferencia del sistema)
- [ ] Accesibilidad (ARIA labels, navegación por teclado)
- [ ] Historial de contraseñas generadas (en memoria de la sesión, sin persistencia por seguridad)
- [ ] Tooltip al copiar ("¡Copiado!")
- [ ] Favicon / iconos de extensión actualizados

### Fase 5 — CI/CD y distribución (semana 7)

- [ ] GitHub Actions: CI (lint + tests en cada push/PR)
- [ ] GitHub Actions: build automático de extensión (.zip) como artefacto
- [ ] Documentar proceso de publicación en stores:
  - [ ] Chrome Web Store
  - [ ] Firefox Add-ons (AMO)
  - [ ] Microsoft Edge Add-ons
- [ ] Actualizar README.md con documentación del nuevo proyecto

---

## Consideraciones

### Seguridad

- **`crypto.getRandomValues()`** en lugar de `Math.random()`. Es la fuente de aleatoriedad recomendada para contextos criptográficos y está disponible en todos los navegadores modernos y en service workers.
- **No persistir contraseñas** en storage del navegador. El historial de sesión se mantiene solo en memoria y se elimina al cerrar el popup.
- **Content Security Policy (CSP)** estricta en el manifest.json — sin `unsafe-eval` ni `unsafe-inline`.
- **Permisos mínimos** en la extensión: solo `clipboardWrite` y `storage`. Sin acceso a pestañas, historial ni datos de navegación.

### Diccionarios

- Las listas actuales contienen ~1,500 palabras EN y ~1,800 palabras ES pero incluyen ruido (nombres de ciudades, marcas, palabras técnicas).
- El nuevo enfoque: curar palabras de **uso cotidiano**, **pronunciables**, entre **6 y 12 caracteres**, sin nombres propios, marcas registradas ni contenido ofensivo.
- Fuente principal EN: [google-10000-english](https://github.com/first20hours/google-10000-english) filtrado.
- Fuente principal ES: lista de frecuencia de subtítulos ([SUBTLEX-ESP](https://www.bcbl.eu/databases/subtlex-esp)) o similar, filtrada con los mismos criterios.
- Tamaño objetivo: ~2,000-3,000 palabras por idioma. Suficiente para buena variedad sin inflar el bundle.

### Compatibilidad de extensión

- **Manifest v3** es obligatorio para Chrome/Edge desde 2024. Firefox lo soporta desde Firefox 109+ con algunas diferencias menores.
- Diferencias clave Firefox vs Chrome en Manifest v3:
  - Firefox usa `browser_specific_settings` para el ID de extensión.
  - Firefox soporta `scripts` en background además de `service_worker`.
  - Se puede manejar con un solo manifest + condicionales mínimos en el build.
- El plugin de Vite para extensiones (CRXJS o `vite-plugin-web-extension`) puede generar builds separados por navegador desde la misma fuente.

### UX de la extensión

- El popup debe ser **rápido**: cargar y mostrar una contraseña en <100ms.
- **Copiar con un clic** es la acción principal — debe ser el elemento más prominente.
- Las opciones avanzadas (modo, idioma, largo) deben ser accesibles pero no abrumar al usuario casual.
- Guardar las preferencias del usuario para que no tenga que reconfigurar cada vez.

### Escalabilidad del core

- El paquete `core` se diseña como librería independiente, publicable en npm (nombre por definir — se busca algo corto, memorable y disponible).
- La arquitectura con `GeneratorOptions` permite agregar:
  - Nuevos idiomas (solo agregar un archivo `dictionaries/fr.ts`).
  - Nuevas transformaciones (ej. leet speak personalizado).
  - Nuevos modos de generación.
- Tree-shakeable: si solo se importa el modo passphrase, no se envía el diccionario completo al bundle.
- El nombre de la extensión en los stores es **Memorable Passwords** — se mantiene por continuidad con la versión ya publicada en Firefox Add-ons.

---

## Ideas futuras

### Corto plazo (post-lanzamiento)

- **Keyboard shortcut global**: generar y copiar contraseña sin abrir el popup (ej. `Ctrl+Shift+P`)
- **Context menu**: click derecho en un campo de contraseña → "Generar contraseña memorable"
- **Autofill**: insertar la contraseña directamente en el campo activo de la página
- **Más idiomas**: francés, portugués, alemán, italiano
- **Palabras temáticas**: categorías opcionales (animales, comida, naturaleza, etc.) para contraseñas más divertidas

### Mediano plazo

- **Web app independiente**: desplegar en yardev.net/pg con la misma librería core, framework ligero (Astro, vanilla)
- **CLI tool**: `npx <nombre-paquete>` para generar contraseñas desde la terminal
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
