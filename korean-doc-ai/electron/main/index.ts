import { app, BrowserWindow, globalShortcut, ipcMain, screen } from 'electron'
import path from 'path'
import { createOverlayWindow, getOverlayWindow } from './overlay'
import { registerIpcHandlers } from './ipc/handler'

const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged

app.whenReady().then(() => {
  createOverlayWindow(isDev)
  registerIpcHandlers()

  // 글로벌 단축키: Cmd+Shift+K → 오버레이 토글
  globalShortcut.register('CommandOrControl+Shift+K', () => {
    const win = getOverlayWindow()
    if (!win) return
    if (win.isVisible()) {
      win.hide()
    } else {
      win.show()
      win.focus()
    }
  })

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createOverlayWindow(isDev)
    }
  })
})

app.on('will-quit', () => {
  globalShortcut.unregisterAll()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
