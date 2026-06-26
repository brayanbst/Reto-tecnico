import { spawn } from 'node:child_process'

const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm'
const children = []

function run(command, args, label) {
  const child = spawn(command, args, {
    cwd: process.cwd(),
    stdio: 'inherit',
    shell: false,
  })

  child.on('exit', (code) => {
    if (code !== 0) {
      console.error(`[${label}] exited with code ${code ?? 'null'}`)
      shutdown(code ?? 1)
    }
  })

  children.push(child)
  return child
}

function shutdown(code = 0) {
  for (const child of children) {
    if (!child.killed) {
      child.kill('SIGTERM')
    }
  }

  process.exit(code)
}

process.on('SIGINT', () => shutdown(0))
process.on('SIGTERM', () => shutdown(0))

const initialBuild = spawn(npmCmd, ['run', 'build'], {
  cwd: process.cwd(),
  stdio: 'inherit',
  shell: false,
})

initialBuild.on('exit', (code) => {
  if (code !== 0) {
    process.exit(code ?? 1)
    return
  }

  run(npmCmd, ['run', 'build:watch'], 'build:watch')
  run(npmCmd, ['run', 'preview:mf'], 'preview:mf')
})
