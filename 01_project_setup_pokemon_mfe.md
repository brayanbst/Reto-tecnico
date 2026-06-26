# PROMPT MAESTRO – RETO TÉCNICO FRONTEND SENIOR (MICROFRONTENDS + REACT)

Actúa como un Arquitecto Frontend Senior especializado en React, Vite, Module Federation, Microfrontends, Zustand y TanStack Query.

Necesito que desarrolles un proyecto completo desde cero siguiendo estrictamente los requerimientos de este reto técnico.

No simplifiques la arquitectura.
No omitas funcionalidades.
No cambies los puertos.
No reemplaces Microfrontends por componentes normales.
No agregues backend.
No agregues autenticación real.

El objetivo es entregar una solución profesional, escalable y alineada con buenas prácticas de Frontend Senior.

---

# OBJETIVO GENERAL

Construir una aplicación basada en Microfrontends para visualizar información de Pokémon utilizando la PokeAPI.

La solución debe estar compuesta por 3 aplicaciones independientes:

1. Shell (Host)
2. Microfrontend Pokemon Detail
3. Microfrontend Pokemon History

La integración debe realizarse utilizando Module Federation.

---

# ARQUITECTURA OBLIGATORIA

La estructura raíz debe ser:

pokemon-mfe-challenge/

├── shell/
├── pokemon-detail/
├── pokemon-history/
└── README.md

Cada aplicación debe ser independiente y ejecutarse por separado.

---

# PUERTOS OBLIGATORIOS

Shell:
http://localhost:3000

Pokemon Detail:
http://localhost:3001

Pokemon History:
http://localhost:3002

No modificar estos puertos.

---

# STACK TECNOLÓGICO

Utilizar:

* React
* TypeScript
* Vite
* Module Federation (@originjs/vite-plugin-federation)
* Zustand
* TanStack Query

Estilos:

Elegir una de las siguientes opciones:

* CSS Modules
  o
* Tailwind

Priorizar simplicidad, mantenibilidad y velocidad de implementación.

---

# RESPONSABILIDADES DE CADA APLICACIÓN

========================================

1. SHELL (HOST)
   ========================================

El Shell será responsable de:

* Login
* Manejo de sesión
* Home
* Navegación
* Layout general
* Theme claro/oscuro
* Modal fullscreen de búsqueda
* Toast global
* Integración con los Microfrontends

El Shell NO debe contener la lógica de detalle ni historial.

Estas responsabilidades pertenecen a los Microfrontends.

---

# LOGIN

Implementar login fake.

Campos:

* Usuario
* Contraseña

Validaciones básicas:

* Campos obligatorios

Al iniciar sesión:

Guardar sesión en localStorage.

Ejemplo:

{
username: "admin",
loggedIn: true
}

Si existe sesión activa:

Ingresar automáticamente al Home.

Debe existir opción:

"Cerrar sesión"

Al cerrar sesión:

* Limpiar sesión
* Redireccionar al Login

---

# HOME

Debe mostrar categorías de Pokémon.

Las categorías corresponden a los tipos de Pokémon.

Consumir:

GET https://pokeapi.co/api/v2/type/{type}

Ejemplos:

fire
water
grass
electric
psychic
rock
ground
ghost
dragon
ice

El Home debe mostrar:

* Categorías
* Pokémon asociados

Regla:

Mostrar únicamente los primeros 10 Pokémon de cada categoría.

Cada Pokémon debe visualizar:

* Imagen
* Nombre

Al hacer clic:

Abrir el Microfrontend Pokemon Detail.

---

# BUSCADOR

Debe existir un botón visible:

"Buscar Pokémon"

Al hacer clic:

Abrir Modal Fullscreen.

---

# MODAL FULLSCREEN

Al abrir:

Consumir:

GET https://pokeapi.co/api/v2/pokemon?limit=30&offset=0

Mostrar:

30 Pokémon.

Cada elemento debe contener:

* Imagen
* Nombre

---

# INFINITE SCROLL

Implementar scroll infinito.

Al llegar al final:

offset += 30

Ejemplo:

limit=30&offset=30

Luego:

limit=30&offset=60

Y así sucesivamente.

Debe existir:

* Loading state
* Error state

Evitar solicitudes duplicadas.

---

# BÚSQUEDA EXACTA

Implementar búsqueda por nombre.

Consumir:

GET https://pokeapi.co/api/v2/pokemon/{name}

Reglas:

* lowercase
* sin espacios
* exact match

Ejemplo válido:

pikachu

Ejemplo inválido:

Pikachu
pika
pika chu

---

# COMPORTAMIENTO DE BÚSQUEDA

Si existe:

Mostrar únicamente ese Pokémon.

Si no existe:

Mostrar mensaje:

"Pokémon no encontrado"

---

# THEME

Implementar:

* Light Theme
* Dark Theme

Persistencia:

localStorage

Al refrescar:

Mantener el tema seleccionado.

---

# TOAST GLOBAL

Al recargar la página:

Si existe un último Pokémon visitado:

Mostrar Toast.

Contenido:

Último Pokémon visitado:
{nombre}

Botón:

Cerrar

---

# REGLA DEL TOAST

Si el usuario lo cierra:

No volver a mostrarlo.

Debe reaparecer únicamente cuando exista una nueva visita a otro Pokémon.

Persistir este comportamiento.

---

========================================
2. MICROFRONTEND POKEMON DETAIL
===============================

Puerto:

3001

Debe exponer:

./PokemonDetail

Mediante Module Federation.

---

# RESPONSABILIDAD

Mostrar el detalle del Pokémon seleccionado.

Consumir:

GET https://pokeapi.co/api/v2/pokemon/{id}

o

GET https://pokeapi.co/api/v2/pokemon/{name}

---

# INFORMACIÓN A MOSTRAR

Imagen:

Priorizar SVG sin fondo cuando exista.

Nombre

Tipos

Stats básicas:

* HP
* Attack
* Defense
* Special Attack
* Special Defense
* Speed

---

# ESTADOS

Implementar:

* Loading
* Error
* Empty State

---

# EVENTO DE VISITA

Cada vez que se abre un detalle:

Debe registrarse una visita.

La visita debe actualizar:

* Historial
* Último Pokémon visitado

Persistir en localStorage.

---

========================================
3. MICROFRONTEND POKEMON HISTORY
================================

Puerto:

3002

Debe exponer:

./PokemonHistory

Mediante Module Federation.

---

# RESPONSABILIDAD

Mostrar historial de Pokémon visitados.

Consumir desde localStorage.

No depende de backend.

---

# INFORMACIÓN

Mostrar:

* Imagen
* Nombre
* Número de visitas

Ejemplo:

Pikachu
Visitas: 5

Charizard
Visitas: 2

---

# REGLAS DE HISTORIAL

Si un Pokémon no existe:

Agregar.

Si ya existe:

Incrementar visits.

No duplicar registros.

Persistir siempre.

---

# ESTRUCTURA SUGERIDA

{
id: number,
name: string,
image: string,
visits: number
}

---

# LOCAL STORAGE

Crear una estrategia clara y documentada.

Ejemplo:

pokemon-history

[
{
"id":25,
"name":"pikachu",
"image":"...",
"visits":4
}
]

último visitado:

last-visited-pokemon

{
"id":25,
"name":"pikachu"
}

toast:

last-toast-dismissed

{
"pokemonId":25
}

La implementación puede variar, pero debe mantener la misma lógica funcional.

---

# MODULE FEDERATION

Shell debe consumir:

pokemonDetail

http://localhost:3001/assets/remoteEntry.js

pokemonHistory

http://localhost:3002/assets/remoteEntry.js

---

# REMOTES

pokemon-detail

Exponer:

./PokemonDetail

pokemon-history

Exponer:

./PokemonHistory

---

# ESTÁNDARES DE CALIDAD

Aplicar:

* Clean Code
* Componentes reutilizables
* Hooks personalizados
* Tipado fuerte con TypeScript
* Separación por features
* Manejo centralizado de estado
* Manejo correcto de errores
* UX fluida
* Código legible

---

# ESTRUCTURA INTERNA RECOMENDADA

src/

app/
features/
shared/
components/
hooks/
services/
store/
types/
utils/

---

# DATA FETCHING

Utilizar TanStack Query.

Implementar:

* caching
* loading
* error handling
* staleTime

Evitar fetch manual repetitivo.

---

# ENTREGABLES

Generar:

1. Proyecto completo
2. Configuración Module Federation
3. Configuración Zustand
4. Configuración TanStack Query
5. Login
6. Home
7. Buscador Fullscreen
8. Infinite Scroll
9. Pokemon Detail MFE
10. Pokemon History MFE
11. Theme persistente
12. Toast persistente
13. README completo

---

# README OBLIGATORIO

Documentar:

* Arquitectura
* Decisiones técnicas
* Estrategia de historial
* Estrategia de persistencia
* Estructura del proyecto
* Instalación
* Ejecución
* Puertos
* Tecnologías utilizadas

---

Desarrolla primero la estructura completa de carpetas y configuración base de los tres proyectos.

Luego implementa progresivamente cada funcionalidad respetando la arquitectura de Microfrontends mediante Module Federation.
