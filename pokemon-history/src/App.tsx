import PokemonHistory from './components/PokemonHistory'
import { navigateTo } from './lib/browser'
import { Environment } from '../../shared/environment'

const environment = Environment.pokemonHistory(import.meta.env)

function App() {
  return (
    <div className="history-standalone-page">
      <div className="history-banner">Pokemon History MFE</div>
      <PokemonHistory
        onBack={() => navigateTo(environment.shellOrigin)}
        onSelectPokemon={(pokemonName) =>
          navigateTo(`${environment.pokemonDetailOrigin}?pokemon=${pokemonName}`)
        }
      />
    </div>
  )
}

export default App
