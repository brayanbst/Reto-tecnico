# Pokemon MFE Challenge

Reto tecnico Frontend Senior implementado con `React`, `TypeScript`, `Vite`, `Module Federation`, `Zustand` y `TanStack Query`.

La solucion esta dividida en tres aplicaciones independientes:

- `shell/` en `http://localhost:3000`
- `pokemon-detail/` en `http://localhost:3001`
- `pokemon-history/` en `http://localhost:3002`

## Funcionalidades implementadas

- Login fake con persistencia de sesion en `localStorage`
- Home con categorias por tipo Pokemon
- Maximo de 10 Pokemon por categoria
- Modal fullscreen de busqueda
- Busqueda exacta por nombre
- Infinite scroll de 30 en 30
- Theme claro/oscuro persistente
- Toast global con el ultimo Pokemon visitado
- Microfrontend remoto de detalle
- Microfrontend remoto de historial
- Historial persistente con conteo de visitas
- Estados de `loading`, `error` y `empty`

## Arquitectura

### Shell

Responsable de:

- login
- layout general
- header y dropdown de usuario
- theme
- modal de busqueda
- home
- toast global
- integracion con remotos via Module Federation

El shell no contiene la vista de detalle ni la vista de historial.

### Pokemon Detail

Expone `./PokemonDetail` mediante Module Federation.

Responsable de:

- consultar el detalle del Pokemon en PokeAPI
- renderizar imagen, tipos y stats
- registrar visitas
- actualizar `pokemon-history`
- actualizar `last-visited-pokemon`

### Pokemon History

Expone `./PokemonHistory` mediante Module Federation.

Responsable de:

- leer el historial desde `localStorage`
- mostrar imagen, nombre y visitas
- limpiar historial

## Estrategia de persistencia

Se utilizan las siguientes llaves:

- `pokemon-session`
- `pokemon-theme`
- `pokemon-history`
- `last-visited-pokemon`
- `last-toast-dismissed`

### Estructura del historial

```json
[
  {
    "id": 25,
    "name": "pikachu",
    "image": "https://...",
    "visits": 4
  }
]
```

### Regla de visitas

- si el Pokemon no existe, se agrega
- si ya existe, se incrementa `visits`
- no se duplican registros
- al visitar un Pokemon tambien se actualiza `last-visited-pokemon`

### Regla del toast

- al cargar el shell, si existe `last-visited-pokemon`, se muestra toast
- si el usuario lo cierra, se guarda `last-toast-dismissed`
- el toast solo vuelve a aparecer cuando se registra una nueva visita

## Instalacion

Desde la raiz del proyecto ya puedes instalar todo automaticamente con un solo comando:

```bash
npm install
```

Ese comando ejecuta tambien la instalacion de:

- `shell`
- `pokemon-detail`
- `pokemon-history`

Si por alguna razon quieres correr la instalacion automatica de nuevo desde la raiz, puedes usar:

```bash
npm run install:all
```

Cada app sigue teniendo su propio `package.json`. Si quieres instalar dependencias por separado, tambien puedes hacerlo asi:

```bash
cd shell && npm install
cd ../pokemon-detail && npm install
cd ../pokemon-history && npm install
```

Opcionalmente, desde la raiz puedes instalar las dependencias de cada app con el gestor que prefieras, pero la ejecucion de despliegue sigue siendo independiente por microfrontend.

## Entornos

La configuracion esta preparada para `local`, `development` y `production`.

- La resolucion de entorno usa `MODE` de Vite
- Tambien soporta `VITE_APP_ENVIRONMENT` como override explicito
- La configuracion compartida vive en `shared/environment.ts`

Archivos de ejemplo disponibles:

- `shell/.env.example`
- `shell/.env.development.example`
- `shell/.env.production.example`
- `pokemon-detail/.env.example`
- `pokemon-detail/.env.development.example`
- `pokemon-detail/.env.production.example`
- `pokemon-history/.env.example`
- `pokemon-history/.env.development.example`
- `pokemon-history/.env.production.example`

Para desplegar a nube en ambiente de desarrollo, la practica recomendada es:

1. configurar variables reales en el proveedor
2. compilar con `--mode development`

Ejemplos:

```bash
cd shell && npm run build:development
cd ../pokemon-detail && npm run build:development
cd ../pokemon-history && npm run build:development
```

Para produccion:

```bash
cd shell && npm run build:production
cd ../pokemon-detail && npm run build:production
cd ../pokemon-history && npm run build:production
```

## Ejecucion local

Solo para desarrollo local, desde la raiz del repo puedes levantar todo con un solo comando:

```bash
npm run dev
```

Eso inicia:

- `shell`
- `pokemon-detail`
- `pokemon-history`

El alias explicito es:

```bash
npm run dev:local
```

Si prefieres levantarlas por separado en local, tambien puedes usar terminales independientes:

```bash
cd shell && npm run dev
cd pokemon-detail && npm run dev
cd pokemon-history && npm run dev
```

Puertos obligatorios:

- `3000` shell
- `3001` pokemon-detail
- `3002` pokemon-history

### Por que existe un solo comando en local

En `local` si conviene un unico comando porque el `shell` depende de que los remotos tambien esten levantados. Si falta uno, aparecen errores como:

- `Failed to fetch dynamically imported module`
- `ERR_CONNECTION_REFUSED` en `remoteEntry.js`

Por eso en desarrollo local la raiz del proyecto actua como orquestador y levanta las tres apps juntas.

Esto mejora:

- onboarding
- velocidad de arranque
- menos errores por olvidar levantar un remoto
- una forma unica de ejecutar el proyecto completo

El script raiz no reemplaza la independencia de los microfrontends. Solo simplifica el trabajo en la maquina local del desarrollador.

## Ejecucion en development y production

Para `development` y `production` no se usa el comando raiz. Cada microfrontend se construye y despliega de forma normal e independiente.

### Por que en nube no se usa un solo comando

En `development` y `production` la buena practica es mantener cada microfrontend separado:

- `shell`
- `pokemon-detail`
- `pokemon-history`

Cada uno tiene su propio build, su propia configuracion y su propio despliegue. Eso permite:

- desplegar un remoto sin reconstruir todo
- cambiar variables por entorno de forma aislada
- mantener independencia real entre microfrontends
- escalar o corregir una app sin acoplar las otras

En otras palabras:

- `local` usa un solo comando por comodidad del desarrollador
- `development` y `production` usan despliegue separado por buena practica de arquitectura

Development:

```bash
cd shell && npm run build:development
cd ../pokemon-detail && npm run build:development
cd ../pokemon-history && npm run build:development
```

Production:

```bash
cd shell && npm run build:production
cd ../pokemon-detail && npm run build:production
cd ../pokemon-history && npm run build:production
```

## Scripts

Cada aplicacion expone:

- `npm run dev`
- `npm run build`
- `npm run lint`
- `npm run preview`

En la raiz solo existen scripts de soporte local:

- `npm run dev`
- `npm run dev:local`
- `npm run build:all`

## Validacion realizada

Se verifico localmente:

```bash
npm run build:all
cd shell && npm run build && npm run lint
cd ../pokemon-detail && npm run build && npm run lint
cd ../pokemon-history && npm run build && npm run lint
```

## Decisiones tecnicas

- `Module Federation` para integrar detalle e historial como remotos reales
- `Zustand` para estado de UI y sesion
- `TanStack Query` para data fetching y cache
- `Axios` para acceso a PokeAPI
- `localStorage` como persistencia del historial, tema y sesion
- CSS plano para mantener velocidad de implementacion y control visual

## Notas

- Los microfrontends tambien pueden ejecutarse en modo standalone para validar su comportamiento de forma aislada.
- El historial se comparte correctamente cuando los remotos se cargan dentro del shell, porque ejecutan sobre el mismo origen del host.
