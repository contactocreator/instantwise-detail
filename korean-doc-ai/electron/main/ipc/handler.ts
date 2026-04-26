import { registerFileHandlers } from './fileHandler'
import { registerAIHandlers } from './aiHandler'
import { registerClipboardHandlers } from './clipboardHandler'

export function registerIpcHandlers(): void {
  registerFileHandlers()
  registerAIHandlers()
  registerClipboardHandlers()
}
