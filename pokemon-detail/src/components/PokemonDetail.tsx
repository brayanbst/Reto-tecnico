import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft } from 'lucide-react'
import '../App.css'
import { fetchPokemonDetail } from '../lib/pokemon'
import { registerPokemonVisit } from '../lib/storage'

export type PokemonDetailProps = {
  pokemonName: string
  onBack: () => void
  onViewHistory: () => void
}

function PokemonDetail({ pokemonName, onBack }: PokemonDetailProps) {
  const detailQuery = useQuery({
    queryKey: ['pokemon-detail', pokemonName],
    queryFn: () => fetchPokemonDetail(pokemonName),
    enabled: Boolean(pokemonName),
    retry: 1,
  })

  useEffect(() => {
    if (!detailQuery.data) {
      return
    }

    registerPokemonVisit({
      id: detailQuery.data.id,
      name: detailQuery.data.name,
      image:
        detailQuery.data.sprites.other['official-artwork'].front_default ??
        detailQuery.data.sprites.front_default ??
        '',
    })
  }, [detailQuery.data])

  if (detailQuery.isLoading) {
    return (
      <main className="detail-page">
        <div className="detail-card state-card">Cargando detalle del Pokemon...</div>
      </main>
    )
  }

  if (detailQuery.isError) {
    return (
      <main className="detail-page">
        <div className="detail-card state-card">No fue posible obtener el detalle.</div>
      </main>
    )
  }

  if (!detailQuery.data) {
    return (
      <main className="detail-page">
        <div className="detail-card state-card">No hay informacion disponible.</div>
      </main>
    )
  }

  const pokemon = detailQuery.data
  const artwork =
    pokemon.sprites.other['official-artwork'].front_default ??
    pokemon.sprites.front_default ??
    ''

  return (
    <main className="detail-page">
      <section className="detail-card">
        <div className="detail-card-accent" aria-hidden="true" />
        <div className="detail-layout">
          <div className="detail-summary">
            <div className="image-wrapper">
              <img src={artwork} alt={pokemon.name} />
            </div>
            <span className="pokemon-number">#{String(pokemon.id).padStart(3, '0')}</span>
            <h1 className="pokemon-name">{capitalize(pokemon.name)}</h1>
            <div className="type-badges">
              {pokemon.types.map((type) => (
                <span key={type.type.name} className="type-badge">
                  {type.type.name}
                </span>
              ))}
            </div>
          </div>

          <section className="stats-card">
            <div className="stats-header">
              <h2>Stats basicos</h2>
              <span className="stats-caption">Base power overview</span>
            </div>
            <div className="stats-list">
              {pokemon.stats.map((stat) => (
                <div key={stat.stat.name} className="stat-row">
                  <span className="stat-label">{formatStatLabel(stat.stat.name)}</span>
                  <strong className="stat-value">{stat.base_stat}</strong>
                  <div className="stat-track">
                    <div
                      className="stat-fill"
                      style={{ width: `${Math.min(stat.base_stat, 120) / 120 * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <button type="button" className="detail-back-button" onClick={onBack}>
          <ArrowLeft size={18} />
          Regresar
        </button>
      </section>
    </main>
  )
}

function formatStatLabel(value: string) {
  return value
    .split('-')
    .map((item) => capitalize(item))
    .join(' ')
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

export default PokemonDetail
