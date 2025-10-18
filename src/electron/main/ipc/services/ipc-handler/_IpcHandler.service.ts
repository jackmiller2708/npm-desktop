import { Context } from "effect";
import type { IIpcHandlerService } from "./_IIpcHandlerService.interface";

export class IpcHandlerService extends Context.Tag("IpcHandlerService")<IpcHandlerService, IIpcHandlerService>() {}