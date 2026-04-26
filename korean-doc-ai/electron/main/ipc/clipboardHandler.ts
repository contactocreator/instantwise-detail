import { ipcMain, clipboard } from 'electron'

export function registerClipboardHandlers(): void {
  ipcMain.handle('clipboard:write', (_event, text: string) => {
    clipboard.writeText(text)
    return true
  })
}
