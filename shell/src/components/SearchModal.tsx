import { useDeferredValue, useEffect, useMemo, useState, type UIEvent } from 'react'
import { useInfiniteQuery, useQuery, type InfiniteData } from '@tanstack/react-query'
import { Search, X } from 'lucide-react'
import {
  extractIdFromUrl,
  fetchPokemonByName,
  fetchPokemonPage,
  getPokemonArtwork,
} from '../lib/pokemon'
import { capitalize } from '../lib/text'
import PanelState from './PanelState'
import PokemonCard, { type PokemonCardData } from './PokemonCard'

type PokemonPage = {
  next: string | null
  results: Array<{ name: string; url: string }>
}

type SearchModalProps = {
  onClose: () => void
  onOpenDetail: (pokemonName: string) => void
}

function SearchModal({ onClose, onOpenDetail }: SearchModalProps) {
  const [search, setSearch] = useState('')
  const deferredSearch = useDeferredValue(search)
  const normalizedSearch = deferredSearch.trim().toLowerCase()
  const exactSearchTerm = normalizedSearch
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/\s+/g, '-')
  const hasSearchValue = normalizedSearch.length > 0

  const pageQuery = useInfiniteQuery({
    queryKey: ['pokemon-search-page'],
    queryFn: ({ pageParam = 0 }) => fetchPokemonPage(pageParam),
    initialPageParam: 0,
    getNextPageParam: (lastPage, _pages, lastPageParam) => {
      if (!lastPage.next) {
        return undefined
      }
      return Number(lastPageParam) + 30
    },
  })

  const exactQuery = useQuery({
    queryKey: ['pokemon-exact-search', exactSearchTerm],
    queryFn: () => fetchPokemonByName(exactSearchTerm),
    enabled: hasSearchValue,
    retry: false,
  })

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', handleEscape)
    }
  }, [onClose])

  const results = useMemo(() => {
    const loadedPokemon = flattenPokemonPages(pageQuery.data)

    if (hasSearchValue) {
      const filteredResults = loadedPokemon
        .filter((pokemon) => pokemon.name.includes(normalizedSearch))
        .map((pokemon) => {
          const id = extractIdFromUrl(pokemon.url)
          return {
            id,
            image: getPokemonArtwork(id),
            name: pokemon.name,
            subtitle: `Pokemon / #${String(id).padStart(3, '0')}`,
          }
        })

      if (!exactQuery.data) {
        return filteredResults
      }

      const exactResult = {
        id: exactQuery.data.id,
        image: exactQuery.data.sprites.other['official-artwork'].front_default ?? '',
        name: exactQuery.data.name,
        subtitle: `${exactQuery.data.types.map((type) => capitalize(type.type.name)).join(' / ')} / #${String(exactQuery.data.id).padStart(3, '0')}`,
      } satisfies PokemonCardData

      if (filteredResults.some((pokemon) => pokemon.id === exactResult.id)) {
        return filteredResults
      }

      return [
        exactResult,
        ...filteredResults,
      ]
    }

    return loadedPokemon.map((pokemon) => {
      const id = extractIdFromUrl(pokemon.url)
      return {
        id,
        image: getPokemonArtwork(id),
        name: pokemon.name,
        subtitle: `Pokemon / #${String(id).padStart(3, '0')}`,
      }
    })
  }, [exactQuery.data, hasSearchValue, normalizedSearch, pageQuery.data])

  const showSearchEmptyState =
    hasSearchValue &&
    !exactQuery.isLoading &&
    !pageQuery.isLoading &&
    results.length === 0

  const showSearchLoadingState =
    hasSearchValue &&
    results.length === 0 &&
    (pageQuery.isLoading || exactQuery.isLoading)

  const handleScroll = (event: UIEvent<HTMLDivElement>) => {
    if (pageQuery.isFetchingNextPage || !pageQuery.hasNextPage) {
      return
    }

    const node = event.currentTarget
    if (node.scrollTop + node.clientHeight >= node.scrollHeight - 160) {
      void pageQuery.fetchNextPage()
    }
  }

  return (
    <div className="modal-backdrop">
      <div className="modal-panel" onScroll={handleScroll}>
        <button type="button" className="close-button" onClick={onClose} aria-label="Cerrar">
          <X size={22} />
        </button>

        <div className="modal-search-bar">
          <Search size={20} />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar un Pokemon"
          />
        </div>

        {showSearchLoadingState ? (
          <PanelState title="Buscando Pokemon..." compact />
        ) : null}

        {showSearchEmptyState ? (
          <PanelState title="No se encontraron Pokemon con ese nombre." compact />
        ) : null}

        <div className="pokemon-grid modal-grid">
          {results.map((pokemon) => (
            <PokemonCard
              key={`${pokemon.name}-${pokemon.id}`}
              pokemon={pokemon}
              onClick={() => {
                onClose()
                onOpenDetail(pokemon.name)
              }}
            />
          ))}
        </div>

        {!hasSearchValue && pageQuery.isLoading ? (
          <PanelState title="Cargando Pokemon..." compact />
        ) : null}

        {!hasSearchValue && pageQuery.isFetchingNextPage ? (
          <p className="list-feedback">Cargando mas Pokemon...</p>
        ) : null}

        {!hasSearchValue && pageQuery.isError ? (
          <p className="list-feedback">Ocurrio un error al cargar el listado.</p>
        ) : null}
      </div>
    </div>
  )
}

function flattenPokemonPages(data: InfiniteData<PokemonPage, unknown> | undefined) {
  return data?.pages.flatMap((page) => page.results) ?? []
}

export default SearchModal
