declare module 'pokemonDetail/PokemonDetail' {
  import { ComponentType } from 'react'
  import type { RemoteDetailProps } from '../App'

  const PokemonDetail: ComponentType<RemoteDetailProps>
  export default PokemonDetail
}

declare module 'pokemonHistory/PokemonHistory' {
  import { ComponentType } from 'react'
  import type { RemoteHistoryProps } from '../App'

  const PokemonHistory: ComponentType<RemoteHistoryProps>
  export default PokemonHistory
}
