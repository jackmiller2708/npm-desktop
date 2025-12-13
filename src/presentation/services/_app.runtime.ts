import { Layer, ManagedRuntime } from "effect/index";
import { CommandRegistryService } from "./command-registry";
import { IPCService } from "./ipc";
import { TitleMenuBusinessService, TitleMenuService } from "./title-menu";

export const appRuntime = ManagedRuntime.make(Layer.empty.pipe(
  Layer.merge(IPCService.Default),
  Layer.merge(TitleMenuService.Default),
  Layer.merge(TitleMenuBusinessService.Default),
  Layer.merge(CommandRegistryService.Default),
));
