import { rmSync } from 'fs'
import { execSync, spawn } from 'child_process'

function killPort(port) {
  if (process.platform !== 'win32') return
  try {
    const output = execSync(`netstat -ano | findstr :${port}`, { encoding: 'utf8' })
    const pids = new Set(
      output
        .split('\n')
        .map((line) => line.trim().split(/\s+/).pop())
        .filter((pid) => pid && /^\d+$/.test(pid))
    )
    for (const pid of pids) {
      try {
        execSync(`taskkill /PID ${pid} /F`, { stdio: 'ignore' })
      } catch {
        // already stopped
      }
    }
  } catch {
    // port not in use
  }
}

killPort(3000)
killPort(3001)
killPort(3002)

try {
  rmSync('.next', { recursive: true, force: true })
} catch {
  // ignore
}

const child = spawn('npx', ['next', 'dev'], { stdio: 'inherit', shell: true })
child.on('exit', (code) => process.exit(code ?? 0))
