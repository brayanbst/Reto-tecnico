import axios from 'axios'
import { Environment } from '../../../shared/environment'

const api = axios.create({
  baseURL: Environment.pokemonDetail(import.meta.env).pokeApiBaseUrl,
})

export async function fetchPokemonDetail(name: string) {
  const response = await api.get<{
    id: number
    name: string
    types: Array<{ type: { name: string } }>
    stats: Array<{ base_stat: number; stat: { name: string } }>
    sprites: {
      front_default: string | null
      other: {
        'official-artwork': {
          front_default: string | null
        }
      }
    }
  }>(`/pokemon/${name}`)

  return {
    ...response.data,
    stats: response.data.stats.filter((stat) =>
      [
        'hp',
        'attack',
        'defense',
        'special-attack',
        'special-defense',
        'speed',
      ].includes(stat.stat.name),
    ),
  }
}
