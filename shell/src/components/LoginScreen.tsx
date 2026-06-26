import { useState, type FormEvent } from 'react'
import { Moon, Sun } from 'lucide-react'
import type { ThemeMode } from '../lib/storage'

type LoginScreenProps = {
  onLogin: (username: string) => void
  theme: ThemeMode
  onToggleTheme: (theme: ThemeMode) => void
}

function LoginScreen({ onLogin, theme, onToggleTheme }: LoginScreenProps) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{ username?: string; password?: string }>({})

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextErrors: { username?: string; password?: string } = {}

    if (!username.trim()) {
      nextErrors.username = 'El usuario es obligatorio.'
    }

    if (!password.trim()) {
      nextErrors.password = 'La contrasena es obligatoria.'
    }

    setErrors(nextErrors)

    if (Object.keys(nextErrors).length === 0) {
      onLogin(username.trim())
    }
  }

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <div className="theme-toggle-row">
          <button
            type="button"
            className="theme-toggle"
            onClick={() => onToggleTheme(theme === 'light' ? 'dark' : 'light')}
            aria-label="Cambiar tema"
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            <span>{theme === 'light' ? 'Oscuro' : 'Claro'}</span>
          </button>
        </div>
        <h1>POKEDEX</h1>
        <p className="subtle-text">Microfrontends con React, Vite y Module Federation.</p>
        <label className="field">
          <span>Usuario</span>
          <input
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="admin"
          />
          {errors.username ? <small>{errors.username}</small> : null}
        </label>
        <label className="field">
          <span>Contrasena</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="••••••••"
          />
          {errors.password ? <small>{errors.password}</small> : null}
        </label>
        <button type="submit" className="primary-button">
          Ingresar
        </button>
      </form>
    </div>
  )
}

export default LoginScreen
