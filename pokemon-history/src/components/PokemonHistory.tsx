import { useEffect } from 'react'
import { ArrowLeft, Trash2 } from 'lucide-react'
import { create } from 'zustand'
import '../App.css'
import { subscribeToPokemonVisits } from '../lib/pokemon-events'
import { clearHistory, getHistory, type HistoryRecord } from '../lib/storage'

export type PokemonHistoryProps = {
  onBack: () => void
  onSelectPokemon: (pokemonName: string) => void
}

type HistoryState = {
  records: HistoryRecord[]
  load: () => void
  clear: () => void
}

const useHistoryStore = create<HistoryState>((set) => ({
  records: getHistory(),
  load: () => set({ records: getHistory() }),
  clear: () => {
    clearHistory()
    set({ records: [] })
  },
}))

function PokemonHistory({ onBack, onSelectPokemon }: PokemonHistoryProps) {
  const { records, load, clear } = useHistoryStore()

  useEffect(() => {
    load()
    return subscribeToPokemonVisits(() => load())
  }, [load])

  return (
    <section className="history-panel">
      <div className="history-actions">
        <button type="button" className="history-button" onClick={onBack}>
          <ArrowLeft size={18} />
          Regresar
        </button>
        <button type="button" className="history-button danger history-button-right" onClick={clear}>
          <Trash2 size={18} />
          Limpiar historial
        </button>
      </div>

      <header className="history-header">
        <h1>Vistos recientemente</h1>
        <p>Los registros se persisten en localStorage y acumulan visitas por Pokemon.</p>
      </header>

      {records.length === 0 ? (
        <div className="history-empty">Aun no has visitado Pokemon.</div>
      ) : (
        <div className="history-list">
          {records.map((record) => (
            <button
              key={record.id}
              type="button"
              className="history-row"
              onClick={() => onSelectPokemon(record.name)}
            >
              <div className="history-image-wrap">
                <img src={record.image} alt={record.name} />
              </div>
              <div className="history-copy">
                <strong>{capitalize(record.name)}</strong>
                <span>Visitas: {record.visits}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </section>
  )
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

export default PokemonHistory
