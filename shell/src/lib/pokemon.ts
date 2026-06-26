import axios from 'axios'
import { Environment } from '../../../shared/environment'

export const pokemonTypes = [
  'fire',
  'water',
  'grass',
  'electric',
  'psychic',
  'rock',
  'ground',
  'ghost',
  'dragon',
  'ice',
]

const api = axios.create({
  baseURL: Environment.shell(import.meta.env).pokeApiBaseUrl,
})

export async function fetchPokemonType(type: string) {
  const response = await api.get<{
    pokemon: Array<{ pokemon: { name: string; url: string } }>
  }>(`/type/${type}`)

  return response.data
}

export async function fetchPokemonPage(offset: number) {
  const response = await api.get<{
    next: string | null
    results: Array<{ name: string; url: string }>
  }>(`/pokemon?limit=30&offset=${offset}`)

  return response.data
}

export async function fetchPokemonByName(name: string) {
  const response = await api.get<{
    id: number
    name: string
    types: Array<{ type: { name: string } }>
    sprites: {
      other: {
        'official-artwork': {
          front_default: string | null
        }
      }
    }
  }>(`/pokemon/${name}`)

  return response.data
}

export function extractIdFromUrl(url: string) {
  const parts = url.split('/').filter(Boolean)
  return Number(parts[parts.length - 1])
}

export function getPokemonArtwork(id: number) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
}
