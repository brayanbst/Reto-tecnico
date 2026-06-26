# PROMPT — DISEÑO UI + ESTRUCTURA VISUAL DEL RETO POKÉMON MICROFRONTENDS

Actúa como Frontend Senior experto en React, Vite, Microfrontends, Module Federation, UX/UI y CSS responsive.

Necesito que implementes el diseño visual del reto técnico respetando las pantallas referenciales adjuntas.

No copies exactamente como wireframe gris, pero usa esa estructura visual como guía.

La aplicación debe verse como una Pokédex moderna, limpia, responsive y profesional.

---

# ESTILO GENERAL

Usar una estética tipo Pokédex:

* Layout limpio.
* Cards con bordes redondeados.
* Sombras suaves.
* Espaciado consistente.
* Responsive.
* Animaciones sutiles.
* Tema claro / oscuro.
* Inputs simples y claros.
* Botones visibles.
* Estados loading/error/empty bien diseñados.

---

# SHELL — LOGIN

Pantalla centrada.

Estructura:

```txt
┌─────────────────────────────┐
│           POKEDEX           │
│      switch Cambiar tema     │
│                             │
│  [ Usuario              ]   │
│  [ Contraseña           ]   │
│  [       Ingresar       ]   │
└─────────────────────────────┘
```

Requisitos visuales:

* Fondo general claro u oscuro según tema.
* Card de login centrada vertical y horizontalmente.
* Título grande “POKEDEX”.
* Debajo del título, switch para cambiar tema.
* Inputs alineados verticalmente.
* Botón principal ancho igual que los inputs.
* Validaciones visibles debajo del input.
* En mobile debe ocupar casi todo el ancho.

---

# SHELL — HOME

Estructura superior:

```txt
┌──────────────────────────────────────────────┐
│ POKEDEX        [Ver historial]   [Usuario ▼] │
└──────────────────────────────────────────────┘
```

Debe tener:

* Header fijo o superior.
* Logo/título POKEDEX a la izquierda.
* Acción “Ver historial”.
* Dropdown de usuario a la derecha.
* Opción cerrar sesión dentro del dropdown.
* Switch de tema visible cerca del header.

Debajo del header:

```txt
[ Buscar un Pokémon ]
```

El buscador debe abrir el modal fullscreen.

---

# HOME — CATEGORÍAS Y CARDS

Mostrar categorías por tipo Pokémon.

Cada categoría debe verse así:

```txt
Categoría: Fire

┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐
│   imagen   │ │   imagen   │ │   imagen   │ │   imagen   │ │   imagen   │
│  pikachu   │ │ charmander │ │ bulbasaur  │ │ squirtle   │ │   ...      │
└────────────┘ └────────────┘ └────────────┘ └────────────┘ └────────────┘
```

Reglas:

* Mostrar máximo 10 Pokémon por categoría.
* Usar grid responsive.
* Desktop: 5 cards por fila si el espacio lo permite.
* Tablet: 3 cards por fila.
* Mobile: 2 cards o 1 según ancho.
* Cards con hover.
* Al hacer hover: elevar card suavemente.
* Al hacer click: abrir detalle Pokémon.
* Cada card debe mostrar imagen arriba y nombre abajo.
* Capitalizar nombre visualmente.
* Mantener name real lowercase para llamadas API.

---

# CARD DE POKÉMON

Diseño mínimo:

```txt
┌────────────────────┐
│      imagen         │
│                     │
│   Nombre Pokémon    │
│   tipo / número     │
└────────────────────┘
```

Estilos:

* Border radius 12px o superior.
* Sombra suave.
* Padding interno.
* Cursor pointer.
* Transición hover.
* Imagen centrada.
* Tamaño consistente.
* Evitar deformar imágenes.
* Skeleton o placeholder mientras carga imagen.

---

# BUSCADOR MODAL FULLSCREEN

Al presionar “Buscar Pokémon”, abrir modal ocupando toda la pantalla.

Estructura:

```txt
┌──────────────────────────────────────────────┐
│                              X               │
│                                              │
│              [ Buscar un Pokémon ]           │
│                                              │
│   ┌────────┐   ┌────────┐   ┌────────┐       │
│   │ imagen │   │ imagen │   │ imagen │       │
│   │ nombre │   │ nombre │   │ nombre │       │
│   └────────┘   └────────┘   └────────┘       │
│                                              │
└──────────────────────────────────────────────┘
```

Requisitos:

* Botón cerrar “X” arriba a la derecha.
* Input centrado arriba.
* Grid de resultados centrado.
* Mostrar 30 Pokémon iniciales.
* Infinite scroll dentro del modal.
* Cargar 30 más al llegar al final.
* Loading visible al final de la lista.
* Si búsqueda exacta existe, mostrar solo 1 card.
* Si no existe, mostrar mensaje centrado “Pokémon no encontrado”.
* El modal debe bloquear el scroll del body.
* Escape debería cerrar el modal si es posible.
* Click en Pokémon cierra modal y abre detalle.

---

# MICROFRONTEND 1 — DETALLE POKÉMON

El detalle debe verse como una vista completa.

Estructura visual:

```txt
┌──────────────────────────────────────────────┐
│ POKEDEX        [Ver historial]   [Usuario ▼] │
├──────────────────────────────────────────────┤
│                                              │
│              ┌────────────────┐              │
│              │ Imagen grande  │              │
│              └────────────────┘              │
│                                              │
│          Nombre del Pokémon                  │
│          Tipos: fire / flying                │
│                                              │
│   ┌──────────────────────────────────────┐   │
│   │ Stats básicos                         │   │
│   │ HP              ███████               │   │
│   │ Attack          █████████             │   │
│   │ Defense         ██████                │   │
│   │ Speed           ████████              │   │
│   └──────────────────────────────────────┘   │
│                                              │
│                 [ Regresar ]                 │
└──────────────────────────────────────────────┘
```

Requisitos:

* Imagen grande centrada.
* Nombre destacado.
* Tipos en badges.
* Stats en lista o barras visuales.
* Botón Regresar.
* Loading, error y empty state.
* Al abrir detalle debe registrar visita en localStorage.
* Debe actualizar último Pokémon visitado.

---

# MICROFRONTEND 2 — HISTORIAL

Vista de historial.

Estructura visual:

```txt
┌──────────────────────────────────────────────┐
│ POKEDEX        [Ver historial]   [Usuario ▼] │
├──────────────────────────────────────────────┤
│              Vistos recientemente            │
├──────────────────────────────────────────────┤
│  ┌────────┐   Pikachu                         │
│  │ imagen │   Visitas: 5                      │
│  └────────┘                                  │
├──────────────────────────────────────────────┤
│  ┌────────┐   Charmander                      │
│  │ imagen │   Visitas: 2                      │
│  └────────┘                                  │
├──────────────────────────────────────────────┤
│ [ Regresar ]           [ Limpiar historial ] │
└──────────────────────────────────────────────┘
```

Requisitos:

* Lista vertical.
* Cada fila con imagen a la izquierda.
* Nombre y conteo a la derecha.
* Separadores sutiles.
* Botón Regresar.
* Botón Limpiar historial.
* Empty state si no hay historial:
  “Aún no has visitado Pokémon”.
* Al limpiar historial, borrar localStorage correspondiente.
* Responsive.

---

# TOAST ÚLTIMO POKÉMON VISITADO

Posición:

* Abajo a la derecha en desktop.
* Abajo centrado en mobile.

Diseño:

```txt
┌──────────────────────────────┐
│ Último Pokémon visitado       │
│ Pikachu                       │
│                         X     │
└──────────────────────────────┘
```

Requisitos:

* Mostrar solo al recargar si existe último Pokémon visitado.
* Debe tener botón cerrar.
* Si el usuario lo cierra, no volver a mostrar hasta nueva visita.
* Animación suave de entrada/salida.
* No bloquear la interfaz.

---

# TEMA CLARO / OSCURO

Implementar variables CSS:

```css
:root {
  --bg: #f5f7fb;
  --surface: #ffffff;
  --text: #111827;
  --muted: #6b7280;
  --border: #e5e7eb;
  --primary: #ef4444;
}

[data-theme="dark"] {
  --bg: #0f172a;
  --surface: #111827;
  --text: #f9fafb;
  --muted: #9ca3af;
  --border: #334155;
  --primary: #f87171;
}
```

Usar estas variables en toda la app.

---

# INPUTS

Estilo:

* Alto mínimo 40px.
* Border 1px sólido.
* Border radius 8px.
* Padding horizontal.
* Focus visible.
* Placeholder claro.
* Error debajo en texto rojo.

---

# BOTONES

Tipos:

1. Primary
2. Secondary
3. Danger
4. Ghost

Primary:

* Fondo color primary.
* Texto blanco.
* Border radius.
* Hover visible.

Secondary:

* Fondo transparente.
* Borde.
* Texto normal.

Danger:

* Para limpiar historial o cerrar sesión.

Ghost:

* Para acciones pequeñas como Ver historial.

---

# RESPONSIVE

Implementar breakpoints:

* Mobile: hasta 640px
* Tablet: 641px a 1024px
* Desktop: 1025px+

Reglas:

* Login centrado.
* Home grid adaptable.
* Modal grid adaptable.
* Header se acomoda en mobile.
* Historial ocupa ancho completo en mobile.

---

# UX OBLIGATORIA

Agregar:

* Loading spinners o skeletons.
* Mensajes de error claros.
* Empty states.
* Hover en cards.
* Transiciones suaves.
* Feedback visual en botones.
* Accesibilidad básica con labels y aria-label.

---

# ENTREGABLES VISUALES

Implementar estas pantallas:

1. Login
2. Home
3. Modal fullscreen buscador
4. Toast último Pokémon visitado
5. Detalle Pokémon
6. Historial

Cada pantalla debe respetar la lógica del reto y parecer una aplicación final, no un wireframe.

---

# IMPORTANTE

No sacrifiques funcionalidad por diseño.

Primero asegurar:

* Microfrontends funcionando.
* Module Federation funcionando.
* PokeAPI funcionando.
* Historial persistente.
* Toast persistente.
* Theme persistente.

Luego aplicar estilos.

Genera componentes reutilizables para:

* Header
* Button
* Input
* PokemonCard
* ThemeToggle
* Toast
* Modal
* EmptyState
* Loader

Mantén el código limpio y organizado.
