import { QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import PokemonDetail from './components/PokemonDetail'
import { getSearchParam, navigateTo } from './lib/browser'
import { Environment } from '../../shared/environment'
import { queryClient } from './lib/query-client'

const environment = Environment.pokemonDetail(import.meta.env)

function App() {
  const [pokemonName, setPokemonName] = useState(
    getSearchParam('pokemon') ?? 'pikachu',
  )

  return (
    <QueryClientProvider client={queryClient}>
      <div className="standalone-page">
        <div className="standalone-toolbar">
          <strong>Pokemon Detail MFE</strong>
          <div className="standalone-controls">
            <input
              value={pokemonName}
              onChange={(event) => setPokemonName(event.target.value.toLowerCase().trim())}
              placeholder="pikachu"
            />
          </div>
        </div>
        <PokemonDetail
          pokemonName={pokemonName || 'pikachu'}
          onBack={() => setPokemonName('pikachu')}
          onViewHistory={() => navigateTo(environment.pokemonHistoryOrigin)}
        />
      </div>
    </QueryClientProvider>
  )
}

export default App
