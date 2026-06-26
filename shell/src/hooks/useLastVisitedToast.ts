import { useEffect } from 'react'
import { subscribeToPokemonVisits } from '../lib/pokemon-events'
import { getDismissedToast, getLastVisitedPokemon } from '../lib/storage'
import { showLastVisitedToast } from '../lib/toast'

export function useLastVisitedToast() {
  useEffect(() => {
    const lastVisited = getLastVisitedPokemon()
    const dismissed = getDismissedToast()

    if (lastVisited && dismissed !== lastVisited.id) {
      showLastVisitedToast(lastVisited)
    }

    return subscribeToPokemonVisits((pokemon) => {
      showLastVisitedToast(pokemon)
    })
  }, [])
}
