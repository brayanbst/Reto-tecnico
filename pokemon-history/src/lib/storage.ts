import { STORAGE_KEYS } from '../../../shared/storage-keys'

export type HistoryRecord = {
  id: number
  name: string
  image: string
  visits: number
}

export function getHistory() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.history) ?? '[]') as HistoryRecord[]
  } catch {
    return []
  }
}

export function clearHistory() {
  localStorage.removeItem(STORAGE_KEYS.history)
  localStorage.removeItem(STORAGE_KEYS.lastVisitedPokemon)
  localStorage.removeItem(STORAGE_KEYS.dismissedToast)
}
