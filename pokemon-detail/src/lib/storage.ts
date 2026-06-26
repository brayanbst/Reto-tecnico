import { STORAGE_KEYS } from '../../../shared/storage-keys'
import { notifyPokemonVisited } from './pokemon-events'

type HistoryRecord = {
  id: number
  name: string
  image: string
  visits: number
}

let lastVisit: { id: number; timestamp: number } | null = null

function getHistory() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.history) ?? '[]') as HistoryRecord[]
  } catch {
    return []
  }
}

export function registerPokemonVisit(pokemon: { id: number; name: string; image: string }) {
  if (lastVisit && lastVisit.id === pokemon.id && Date.now() - lastVisit.timestamp < 1200) {
    return
  }

  lastVisit = { id: pokemon.id, timestamp: Date.now() }
  const history = getHistory()
  const existing = history.find((entry) => entry.id === pokemon.id)

  const nextHistory = existing
    ? history.map((entry) =>
        entry.id === pokemon.id ? { ...entry, visits: entry.visits + 1 } : entry,
      )
    : [{ ...pokemon, visits: 1 }, ...history]

  localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(nextHistory))
  localStorage.setItem(STORAGE_KEYS.lastVisitedPokemon, JSON.stringify(pokemon))
  localStorage.removeItem(STORAGE_KEYS.dismissedToast)
  notifyPokemonVisited(pokemon)
}
