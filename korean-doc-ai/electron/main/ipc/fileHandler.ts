import { ipcMain } from 'electron'
import { parseFile } from '../parsers/parserFactory'

export function registerFileHandlers(): void {
  ipcMain.handle('file:parse', async (_event, filePath: string) => {
    try {
      const result = await parseFile(filePath)
      return { success: true, data: result }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      return { success: false, error: message }
    }
  })
}
