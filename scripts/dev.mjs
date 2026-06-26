import { spawn } from 'node:child_process'

const apps = [
  {
    name: 'shell',
    cwd: new URL('../shell/', import.meta.url),
    color: '\x1b[36m',
  },
  {
    name: 'pokemon-detail',
    cwd: new URL('../pokemon-detail/', import.meta.url),
    color: '\x1b[33m',
  },
  {
    name: 'pokemon-history',
    cwd: new URL('../pokemon-history/', import.meta.url),
    color: '\x1b[35m',
  },
]

const reset = '\x1b[0m'
const children = []
let shuttingDown = false

function prefixStream(stream, label, color) {
  let buffer = ''

  stream.on('data', (chunk) => {
    buffer += chunk.toString()
    const lines = buffer.split('\n')
    buffer = lines.pop() ?? ''

    for (const line of lines) {
      if (!line.length) {
        continue
      }

      process.stdout.write(`${color}[${label}]${reset} ${line}\n`)
    }
  })

  stream.on('end', () => {
    if (buffer.length) {
      process.stdout.write(`${color}[${label}]${reset} ${buffer}\n`)
    }
  })
}

function shutdown(exitCode = 0) {
  if (shuttingDown) {
    return
  }

  shuttingDown = true

  for (const child of children) {
    if (!child.killed) {
      child.kill('SIGINT')
    }
  }

  setTimeout(() => {
    process.exit(exitCode)
  }, 250)
}

for (const app of apps) {
  const child = spawn('npm', ['run', 'dev'], {
    cwd: app.cwd,
    stdio: ['inherit', 'pipe', 'pipe'],
    shell: process.platform === 'win32',
  })

  children.push(child)
  prefixStream(child.stdout, app.name, app.color)
  prefixStream(child.stderr, app.name, app.color)

  child.on('exit', (code, signal) => {
    if (shuttingDown) {
      return
    }

    const detail = signal ? `signal ${signal}` : `code ${code ?? 0}`
    process.stderr.write(`\n${app.name} exited unexpectedly with ${detail}.\n`)
    shutdown(code ?? 1)
  })
}

process.on('SIGINT', () => shutdown(0))
process.on('SIGTERM', () => shutdown(0))
