import { useEffect, useState } from 'react'
import { ArrowLeft, Trash2 } from 'lucide-react'
import { subscribeToPokemonVisits } from '../lib/pokemon-events'
import { capitalize } from '../lib/text'
import { clearPokemonHistory, getPokemonHistory, type HistoryRecord } from '../lib/storage'

type HistoryFallbackProps = {
  onBack: () => void
  onSelectPokemon: (pokemonName: string) => void
}

function HistoryFallback({ onBack, onSelectPokemon }: HistoryFallbackProps) {
  const [records, setRecords] = useState<HistoryRecord[]>(() => getPokemonHistory())

  useEffect(() => {
    setRecords(getPokemonHistory())
    return subscribeToPokemonVisits(() => {
      setRecords(getPokemonHistory())
    })
  }, [])

  return (
    <section className="category-section history-fallback">
      <div className="history-fallback-actions">
        <button type="button" className="ghost-button" onClick={onBack}>
          <ArrowLeft size={18} />
          Regresar
        </button>
        <button
          type="button"
          className="ghost-button history-clear-button"
          onClick={() => {
            clearPokemonHistory()
            setRecords([])
          }}
        >
          <Trash2 size={18} />
          Limpiar historial
        </button>
      </div>

      <div className="history-fallback-header">
        <h2>Vistos recientemente</h2>
      </div>

      {records.length === 0 ? (
        <div className="panel-state compact">Aun no has visitado Pokemon.</div>
      ) : (
        <div className="history-fallback-list">
          {records.map((record) => (
            <button
              key={record.id}
              type="button"
              className="pokemon-card history-fallback-card"
              onClick={() => onSelectPokemon(record.name)}
            >
              <div className="pokemon-image-wrap">
                <img src={record.image} alt={record.name} />
              </div>
              <div className="pokemon-card-body">
                <h3>{capitalize(record.name)}</h3>
                <p>Visitas: {record.visits}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </section>
  )
}

export default HistoryFallback
