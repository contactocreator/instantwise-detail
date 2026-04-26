import { spawn, ChildProcess } from 'child_process'
import path from 'path'
import { BrowserWindow } from 'electron'
import readline from 'readline'

let bridge: ChildProcess | null = null

export function startTextWatcher(): void {
  const scriptPath = path.join(__dirname, '../../../native/accessibility_bridge.py')

  bridge = spawn('python3', [scriptPath], {
    stdio: ['ignore', 'pipe', 'pipe'],
  })

  if (!bridge.stdout) return

  const rl = readline.createInterface({ input: bridge.stdout })

  rl.on('line', (line) => {
    try {
      const data = JSON.parse(line)
      if (data.type === 'selection' && data.text) {
        const win = BrowserWindow.getAllWindows()[0]
        win?.webContents.send('selection:changed', {
          text: data.text,
          x: data.x ?? 0,
          y: data.y ?? 0,
        })
      }
    } catch {
      // JSON 파싱 실패 무시
    }
  })

  bridge.stderr?.on('data', (data) => {
    console.error('[accessibility_bridge]', data.toString())
  })

  bridge.on('exit', (code) => {
    console.log(`[accessibility_bridge] 종료 코드: ${code}`)
    bridge = null
  })
}

export function stopTextWatcher(): void {
  bridge?.kill()
  bridge = null
}
