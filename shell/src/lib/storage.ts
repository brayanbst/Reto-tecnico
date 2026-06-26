import { STORAGE_KEYS } from '../../../shared/storage-keys'

export type ThemeMode = 'light' | 'dark'

export type SessionData = {
  username: string
  loggedIn: boolean
}

export type HistoryRecord = {
  id: number
  name: string
  image: string
  visits: number
}

export type PokemonSummary = {
  id: number
  name: string
  image: string
}

function safeParse<T>(value: string | null, fallback: T): T {
  if (!value) {
    return fallback
  }

  try {
    return JSON.parse(value) as T
  } catch {
    return fallback
  }
}

export function getSession(): SessionData {
  return safeParse<SessionData>(localStorage.getItem(STORAGE_KEYS.session), {
    username: '',
    loggedIn: false,
  })
}

export function saveSession(session: SessionData) {
  localStorage.setItem(STORAGE_KEYS.session, JSON.stringify(session))
}

export function getTheme(): ThemeMode {
  return localStorage.getItem(STORAGE_KEYS.theme) === 'dark' ? 'dark' : 'light'
}

export function saveTheme(theme: ThemeMode) {
  localStorage.setItem(STORAGE_KEYS.theme, theme)
}

export function getPokemonHistory() {
  return safeParse<HistoryRecord[]>(localStorage.getItem(STORAGE_KEYS.history), [])
}

export function savePokemonHistory(history: HistoryRecord[]) {
  localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(history))
}

export function clearPokemonHistory() {
  localStorage.removeItem(STORAGE_KEYS.history)
  localStorage.removeItem(STORAGE_KEYS.lastVisitedPokemon)
  localStorage.removeItem(STORAGE_KEYS.dismissedToast)
}

export function getLastVisitedPokemon() {
  return safeParse<PokemonSummary | null>(localStorage.getItem(STORAGE_KEYS.lastVisitedPokemon), null)
}

export function saveLastVisitedPokemon(pokemon: PokemonSummary) {
  localStorage.setItem(STORAGE_KEYS.lastVisitedPokemon, JSON.stringify(pokemon))
}

export function getDismissedToast() {
  const value = safeParse<{ pokemonId: number } | null>(
    localStorage.getItem(STORAGE_KEYS.dismissedToast),
    null,
  )
  return value?.pokemonId ?? null
}

export function dismissToastForPokemon(pokemonId: number) {
  localStorage.setItem(STORAGE_KEYS.dismissedToast, JSON.stringify({ pokemonId }))
}
