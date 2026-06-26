import { useState } from 'react'
import { ChevronDown, House, Moon, Sun, User } from 'lucide-react'
import type { ThemeMode } from '../lib/storage'

type HeaderProps = {
  theme: ThemeMode
  username: string
  onToggleTheme: (theme: ThemeMode) => void
  onGoHome: () => void
  onOpenHistory: () => void
  onLogout: () => void
}

function Header({
  theme,
  username,
  onToggleTheme,
  onGoHome,
  onOpenHistory,
  onLogout,
}: HeaderProps) {
  const [openMenu, setOpenMenu] = useState(false)

  return (
    <header className="shell-header">
      <div className="header-brand-row">
        <button type="button" className="brand-button" onClick={onGoHome}>
          POKEDEX
        </button>
        <nav className="header-nav" aria-label="Navegacion principal">
          <button type="button" className="ghost-button nav-button" onClick={onGoHome}>
            <House size={18} />
            Inicio
          </button>
          <button type="button" className="ghost-button nav-button" onClick={onOpenHistory}>
            Ver historial
          </button>
        </nav>
      </div>

      <div className="header-actions">
        <button
          type="button"
          className="theme-toggle"
          onClick={() => onToggleTheme(theme === 'light' ? 'dark' : 'light')}
          aria-label="Cambiar tema"
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          <span>{theme === 'light' ? 'Oscuro' : 'Claro'}</span>
        </button>
        <div className="user-menu">
          <button
            type="button"
            className="ghost-button user-button"
            onClick={() => setOpenMenu((current) => !current)}
            aria-expanded={openMenu}
          >
            <User size={18} />
            <span>{username}</span>
            <ChevronDown size={16} className={`chevron${openMenu ? ' open' : ''}`} />
          </button>
          {openMenu ? (
            <div className="dropdown">
              <button
                type="button"
                className="dropdown-item"
                onClick={() => {
                  setOpenMenu(false)
                  onGoHome()
                }}
              >
                Inicio
              </button>
              <button
                type="button"
                className="dropdown-item"
                onClick={() => {
                  setOpenMenu(false)
                  onOpenHistory()
                }}
              >
                Ver historial
              </button>
              <button
                type="button"
                className="dropdown-item danger-item"
                onClick={() => {
                  setOpenMenu(false)
                  onLogout()
                }}
              >
                Cerrar sesion
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  )
}

export default Header
