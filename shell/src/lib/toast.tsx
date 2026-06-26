import toast from 'react-hot-toast'
import LastVisitedToast from '../components/LastVisitedToast'
import type { PokemonSummary } from './storage'

const LAST_VISITED_TOAST_ID = 'last-visited'

export function hideLastVisitedToast() {
  toast.remove(LAST_VISITED_TOAST_ID)
}

export function showLastVisitedToast(pokemon: PokemonSummary) {
  hideLastVisitedToast()
  toast.custom(
    (instance) => (
      <LastVisitedToast
        pokemon={pokemon}
        onClose={() => {
          toast.remove(instance.id)
        }}
      />
    ),
    { id: LAST_VISITED_TOAST_ID },
  )
}
