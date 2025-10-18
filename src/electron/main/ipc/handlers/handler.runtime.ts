import { ManagedRuntime } from "effect/index";
import { HandlerLayer } from "./handler.layer";

export const handlerRuntime = ManagedRuntime.make(HandlerLayer);
