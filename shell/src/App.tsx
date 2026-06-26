import { Component, lazy, Suspense, useEffect, useMemo, useState, type ErrorInfo } from 'react'
import { QueryClientProvider, useQueries } from '@tanstack/react-query'
import { Search } from 'lucide-react'
import { create } from 'zustand'
import './App.css'
import Header from './components/Header'
import HistoryFallback from './components/HistoryFallback'
import LoginScreen from './components/LoginScreen'
import PanelState from './components/PanelState'
import PokemonCard from './components/PokemonCard'
import SearchModal from './components/SearchModal'
import ShellToaster from './components/ShellToaster'
import { useLastVisitedToast } from './hooks/useLastVisitedToast'
import { queryClient } from './lib/query-client'
import {
  clearPokemonHistory,
  getSession,
  getTheme,
  saveSession,
  saveTheme,
  type ThemeMode,
} from './lib/storage'
import {
  extractIdFromUrl,
  fetchPokemonType,
  getPokemonArtwork,
  pokemonTypes,
} from './lib/pokemon'
import { capitalize } from './lib/text'
import { hideLastVisitedToast } from './lib/toast'

const PokemonDetail = lazy(() => import('pokemonDetail/PokemonDetail'))
const PokemonHistory = lazy(() => import('pokemonHistory/PokemonHistory'))

type ViewMode = 'home' | 'detail' | 'history'

type AppState = {
  theme: ThemeMode
  loggedIn: boolean
  username: string
  view: ViewMode
  selectedPokemonName: string | null
  setTheme: (theme: ThemeMode) => void
  login: (username: string) => void
  logout: () => void
  goHome: () => void
  openDetail: (pokemonName: string) => void
  openHistory: () => void
}

const useAppStore = create<AppState>((set) => ({
  theme: getTheme(),
  loggedIn: getSession().loggedIn,
  username: getSession().username,
  view: 'home',
  selectedPokemonName: null,
  setTheme: (theme) => {
    saveTheme(theme)
    set({ theme })
  },
  login: (username) => {
    saveSession({ username, loggedIn: true })
    set({ loggedIn: true, username, view: 'home' })
  },
  logout: () => {
    clearPokemonHistory()
    hideLastVisitedToast()
    saveSession({ username: '', loggedIn: false })
    set({
      loggedIn: false,
      username: '',
      view: 'home',
      selectedPokemonName: null,
    })
  },
  goHome: () => set({ view: 'home', selectedPokemonName: null }),
  openDetail: (selectedPokemonName) => set({ view: 'detail', selectedPokemonName }),
  openHistory: () => set({ view: 'history' }),
}))

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RemoteBoundary>
        <PokedexApp />
      </RemoteBoundary>
      <ShellToaster />
    </QueryClientProvider>
  )
}

function RemoteBoundary({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<PanelState title="Cargando microfrontend..." />}>
      {children}
    </Suspense>
  )
}

type RemoteErrorBoundaryProps = {
  children: React.ReactNode
  fallback?: React.ReactNode
  onReset?: () => void
  resetKey: string
  title: string
}

type RemoteErrorBoundaryState = {
  hasError: boolean
}

class RemoteErrorBoundary extends Component<
  RemoteErrorBoundaryProps,
  RemoteErrorBoundaryState
> {
  state: RemoteErrorBoundaryState = {
    hasError: false,
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(_error: Error, _errorInfo: ErrorInfo) {
    //dataa
  }

  componentDidUpdate(prevProps: RemoteErrorBoundaryProps) {
    if (prevProps.resetKey !== this.props.resetKey && this.state.hasError) {
      this.setState({ hasError: false })
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="panel-state remote-error-panel">
          <div>
            <strong>{this.props.title}</strong>
            <p className="remote-error-copy">
              Verifica que el microfrontend remoto este levantado y escuchando en su puerto.
            </p>
          </div>
          <div className="remote-error-actions">
            <button
              type="button"
              className="primary-button"
              onClick={() => {
                this.setState({ hasError: false })
              }}
            >
              Reintentar
            </button>
            {this.props.onReset ? (
              <button type="button" className="ghost-button" onClick={this.props.onReset}>
                Volver al inicio
              </button>
            ) : null}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

function PokedexApp() {
  const {
    theme,
    loggedIn,
    username,
    view,
    selectedPokemonName,
    setTheme,
    login,
    logout,
    goHome,
    openDetail,
    openHistory,
  } = useAppStore()

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  useLastVisitedToast()

  if (!loggedIn) {
    return <LoginScreen onLogin={login} theme={theme} onToggleTheme={setTheme} />
  }

  return (
    <div className="app-shell">
      <Header
        theme={theme}
        username={username}
        onToggleTheme={setTheme}
        onGoHome={goHome}
        onOpenHistory={openHistory}
        onLogout={logout}
      />
      <main className={`shell-main${view === 'detail' ? ' shell-main-detail' : ''}`}>
        {view === 'home' && (
          <HomeView onOpenDetail={openDetail} />
        )}
        {view === 'detail' && selectedPokemonName && (
          <RemoteErrorBoundary
            resetKey={`detail-${selectedPokemonName}`}
            title="No fue posible cargar el detalle del Pokemon."
            onReset={goHome}
          >
            <Suspense fallback={<PanelState title="Cargando detalle..." />}>
              <PokemonDetail
                pokemonName={selectedPokemonName}
                onBack={goHome}
                onViewHistory={openHistory}
              />
            </Suspense>
          </RemoteErrorBoundary>
        )}
        {view === 'history' && (
          <RemoteErrorBoundary
            resetKey="history"
            title="No fue posible cargar el historial."
            onReset={goHome}
            fallback={
              <HistoryFallback onBack={goHome} onSelectPokemon={openDetail} />
            }
          >
            <Suspense fallback={<PanelState title="Cargando historial..." />}>
              <PokemonHistory
                onBack={goHome}
                onSelectPokemon={openDetail}
              />
            </Suspense>
          </RemoteErrorBoundary>
        )}
      </main>
    </div>
  )
}

function HomeView({ onOpenDetail }: { onOpenDetail: (pokemonName: string) => void }) {
  const [searchOpen, setSearchOpen] = useState(false)
  const categoryQueries = useQueries({
    queries: pokemonTypes.map((type) => ({
      queryKey: ['pokemon-type', type],
      queryFn: () => fetchPokemonType(type),
    })),
  })

  const categories = useMemo(() => {
    return categoryQueries.map((query, index) => ({
      type: pokemonTypes[index],
      ...query,
    }))
  }, [categoryQueries])

  const loading = categories.some((query) => query.isLoading)
  const hasError = categories.some((query) => query.isError)

  return (
    <>
      <section className="home-toolbar">
        <button type="button" className="search-trigger" onClick={() => setSearchOpen(true)}>
          <Search size={20} />
          Buscar un Pokemon
        </button>
      </section>

      {loading ? <PanelState title="Cargando categorias..." /> : null}
      {hasError ? <PanelState title="No fue posible cargar las categorias." /> : null}

      {!loading && !hasError ? (
        <div className="category-stack">
          {categories.map((query) => (
            <section key={query.type} className="category-section">
              <div className="category-title-row">
                <h2>{capitalize(query.type)}</h2>
                <span>{query.data?.pokemon.length ?? 0} pokemon</span>
              </div>
              <div className="pokemon-grid">
                {query.data?.pokemon.slice(0, 10).map((entry) => {
                  const id = extractIdFromUrl(entry.pokemon.url)
                  return (
                    <PokemonCard
                      key={`${query.type}-${entry.pokemon.name}`}
                      pokemon={{
                        id,
                        image: getPokemonArtwork(id),
                        name: entry.pokemon.name,
                        subtitle: `${capitalize(query.type)} / #${String(id).padStart(3, '0')}`,
                      }}
                      onClick={() => onOpenDetail(entry.pokemon.name)}
                    />
                  )
                })}
              </div>
            </section>
          ))}
        </div>
      ) : null}

      {searchOpen ? (
        <SearchModal onClose={() => setSearchOpen(false)} onOpenDetail={onOpenDetail} />
      ) : null}
    </>
  )
}

export type RemoteHistoryProps = {
  onBack: () => void
  onSelectPokemon: (pokemonName: string) => void
}

export type RemoteDetailProps = {
  pokemonName: string
  onBack: () => void
  onViewHistory: () => void
}

export default App
