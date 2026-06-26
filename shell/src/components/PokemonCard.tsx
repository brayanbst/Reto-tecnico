import { capitalize } from '../lib/text'

export type PokemonCardData = {
  id: number
  image: string
  name: string
  subtitle: string
}

type PokemonCardProps = {
  pokemon: PokemonCardData
  onClick: () => void
}

function PokemonCard({ pokemon, onClick }: PokemonCardProps) {
  return (
    <button type="button" className="pokemon-card" onClick={onClick}>
      <div className="pokemon-image-wrap">
        <img src={pokemon.image} alt={pokemon.name} loading="lazy" />
      </div>
      <div className="pokemon-card-body">
        <h3>{capitalize(pokemon.name)}</h3>
        <p>{pokemon.subtitle}</p>
      </div>
    </button>
  )
}

export default PokemonCard
