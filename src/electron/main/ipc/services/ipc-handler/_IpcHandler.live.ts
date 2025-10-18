import { Effect, Layer } from "effect";
import { ipcMain } from "electron";
import { IpcHandlerService } from "./_IpcHandler.service";

export const IpcHandlerServiceLive = Layer.succeed(IpcHandlerService, IpcHandlerService.of({
  register: () => Effect.sync(() => {
    ipcMain.handle("npm:install", async (_, pkg: string) => {
      // delegate to another Effect-based service
      console.log(`Installing ${pkg}`)
      return { success: true }
    })
  }),
}))