import { BrowserWindow, screen, ipcMain } from 'electron'
import path from 'path'

let overlayWindow: BrowserWindow | null = null

export function createOverlayWindow(isDev: boolean): BrowserWindow {
  const { width: screenWidth } = screen.getPrimaryDisplay().workAreaSize

  overlayWindow = new BrowserWindow({
    width: 380,
    height: 56,
    x: screenWidth - 400,
    y: 20,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    resizable: false,
    skipTaskbar: true,
    hasShadow: false,
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  overlayWindow.setAlwaysOnTop(true, 'floating')
  overlayWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true })

  if (isDev) {
    overlayWindow.loadURL('http://localhost:5173')
    overlayWindow.webContents.openDevTools({ mode: 'detach' })
  } else {
    overlayWindow.loadFile(path.join(__dirname, '../../dist/index.html'))
  }

  overlayWindow.on('closed', () => {
    overlayWindow = null
  })

  // 오버레이 크기/위치 변경 IPC
  ipcMain.on('overlay:resize', (_event, size: { width: number; height: number }) => {
    if (!overlayWindow) return
    overlayWindow.setSize(size.width, size.height)
  })

  ipcMain.on('overlay:move', (_event, pos: { x: number; y: number }) => {
    if (!overlayWindow) return
    overlayWindow.setPosition(pos.x, pos.y)
  })

  ipcMain.on('overlay:pin', (_event, alwaysOnTop: boolean) => {
    if (!overlayWindow) return
    overlayWindow.setAlwaysOnTop(alwaysOnTop, 'floating')
  })

  return overlayWindow
}

export function getOverlayWindow(): BrowserWindow | null {
  return overlayWindow
}
