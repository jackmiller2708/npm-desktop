import { ManagedRuntime } from "effect/index";
import { AppLayer } from "./app.layer";

export const appRuntime = ManagedRuntime.make(AppLayer);
