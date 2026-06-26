import { dismissToastForPokemon, type PokemonSummary } from '../lib/storage'
import { capitalize } from '../lib/text'

type LastVisitedToastProps = {
  pokemon: PokemonSummary
  onClose: () => void
}

function LastVisitedToast({ pokemon, onClose }: LastVisitedToastProps) {
  return (
    <div className="toast-card">
      <div>
        <p className="toast-label">Ultimo Pokemon visitado</p>
        <strong>{capitalize(pokemon.name)}</strong>
      </div>
      <button
        type="button"
        className="ghost-button"
        onClick={() => {
          dismissToastForPokemon(pokemon.id)
          onClose()
        }}
      >
        Cerrar
      </button>
    </div>
  )
}

export default LastVisitedToast
