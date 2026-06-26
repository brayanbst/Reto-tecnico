export type AppEnvironmentMode = 'local' | 'development' | 'production'

export type EnvironmentSource = Record<string, string | undefined>

export type ShellEnvironment = {
  mode: AppEnvironmentMode
  shellOrigin: string
  pokemonDetailOrigin: string
  pokemonHistoryOrigin: string
  pokemonDetailRemoteEntry: string
  pokemonHistoryRemoteEntry: string
  pokeApiBaseUrl: string
  shellPort: number
}

export type PokemonDetailEnvironment = {
  mode: AppEnvironmentMode
  shellOrigin: string
  pokemonHistoryOrigin: string
  pokeApiBaseUrl: string
  detailPort: number
}

export type PokemonHistoryEnvironment = {
  mode: AppEnvironmentMode
  shellOrigin: string
  pokemonDetailOrigin: string
  historyPort: number
}

const LOCAL_DEFAULTS = {
  shellOrigin: 'http://localhost:3000',
  pokemonDetailOrigin: 'http://localhost:3001',
  pokemonHistoryOrigin: 'http://localhost:3002',
  pokemonDetailRemoteEntry: 'http://localhost:3001/assets/remoteEntry.js',
  pokemonHistoryRemoteEntry: 'http://localhost:3002/assets/remoteEntry.js',
  pokeApiBaseUrl: 'https://pokeapi.co/api/v2',
  shellPort: 3000,
  detailPort: 3001,
  historyPort: 3002,
} as const

const DEFAULTS_BY_MODE: Record<AppEnvironmentMode, typeof LOCAL_DEFAULTS> = {
  local: LOCAL_DEFAULTS,
  development: LOCAL_DEFAULTS,
  production: LOCAL_DEFAULTS,
}

function parseMode(value: string | undefined): AppEnvironmentMode {
  if (value === 'local' || value === 'development' || value === 'production') {
    return value
  }

  if (value === 'dev') {
    return 'development'
  }

  if (value === 'prod') {
    return 'production'
  }

  return 'local'
}

function parsePort(value: string | undefined, fallback: number) {
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
}

export class Environment {
  static shell(source: EnvironmentSource = {}): ShellEnvironment {
    const mode = parseMode(
      source.VITE_APP_ENVIRONMENT ?? source.APP_ENVIRONMENT ?? source.MODE,
    )
    const defaults = DEFAULTS_BY_MODE[mode]

    return {
      mode,
      shellOrigin: source.VITE_SHELL_ORIGIN ?? source.SHELL_ORIGIN ?? defaults.shellOrigin,
      pokemonDetailOrigin:
        source.VITE_POKEMON_DETAIL_ORIGIN ??
        source.POKEMON_DETAIL_ORIGIN ??
        defaults.pokemonDetailOrigin,
      pokemonHistoryOrigin:
        source.VITE_POKEMON_HISTORY_ORIGIN ??
        source.POKEMON_HISTORY_ORIGIN ??
        defaults.pokemonHistoryOrigin,
      pokemonDetailRemoteEntry:
        source.VITE_POKEMON_DETAIL_REMOTE_ENTRY ??
        source.POKEMON_DETAIL_REMOTE_ENTRY ??
        defaults.pokemonDetailRemoteEntry,
      pokemonHistoryRemoteEntry:
        source.VITE_POKEMON_HISTORY_REMOTE_ENTRY ??
        source.POKEMON_HISTORY_REMOTE_ENTRY ??
        defaults.pokemonHistoryRemoteEntry,
      pokeApiBaseUrl:
        source.VITE_POKEAPI_BASE_URL ?? source.POKEAPI_BASE_URL ?? defaults.pokeApiBaseUrl,
      shellPort: parsePort(source.VITE_SHELL_PORT ?? source.SHELL_PORT, defaults.shellPort),
    }
  }

  static pokemonDetail(source: EnvironmentSource = {}): PokemonDetailEnvironment {
    const mode = parseMode(
      source.VITE_APP_ENVIRONMENT ?? source.APP_ENVIRONMENT ?? source.MODE,
    )
    const defaults = DEFAULTS_BY_MODE[mode]

    return {
      mode,
      shellOrigin: source.VITE_SHELL_ORIGIN ?? source.SHELL_ORIGIN ?? defaults.shellOrigin,
      pokemonHistoryOrigin:
        source.VITE_POKEMON_HISTORY_ORIGIN ??
        source.POKEMON_HISTORY_ORIGIN ??
        defaults.pokemonHistoryOrigin,
      pokeApiBaseUrl:
        source.VITE_POKEAPI_BASE_URL ?? source.POKEAPI_BASE_URL ?? defaults.pokeApiBaseUrl,
      detailPort: parsePort(
        source.VITE_POKEMON_DETAIL_PORT ?? source.POKEMON_DETAIL_PORT,
        defaults.detailPort,
      ),
    }
  }

  static pokemonHistory(source: EnvironmentSource = {}): PokemonHistoryEnvironment {
    const mode = parseMode(
      source.VITE_APP_ENVIRONMENT ?? source.APP_ENVIRONMENT ?? source.MODE,
    )
    const defaults = DEFAULTS_BY_MODE[mode]

    return {
      mode,
      shellOrigin: source.VITE_SHELL_ORIGIN ?? source.SHELL_ORIGIN ?? defaults.shellOrigin,
      pokemonDetailOrigin:
        source.VITE_POKEMON_DETAIL_ORIGIN ??
        source.POKEMON_DETAIL_ORIGIN ??
        defaults.pokemonDetailOrigin,
      historyPort: parsePort(
        source.VITE_POKEMON_HISTORY_PORT ?? source.POKEMON_HISTORY_PORT,
        defaults.historyPort,
      ),
    }
  }
}
