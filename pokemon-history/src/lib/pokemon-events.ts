const POKEMON_VISIT_EVENT = 'pokemon:last-visited-updated'
const EVENT_BUS_KEY = '__pokemonEventBus__'

function getPokemonEventBus() {
  const scope = globalThis as typeof globalThis & {
    [EVENT_BUS_KEY]?: EventTarget
  }

  if (!scope[EVENT_BUS_KEY]) {
    scope[EVENT_BUS_KEY] = new EventTarget()
  }

  return scope[EVENT_BUS_KEY]
}

export function subscribeToPokemonVisits(listener: () => void) {
  const bus = getPokemonEventBus()
  bus.addEventListener(POKEMON_VISIT_EVENT, listener)
  return () => bus.removeEventListener(POKEMON_VISIT_EVENT, listener)
}
