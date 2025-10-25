import type { IPCRegistry } from "@shared/ipc/registry";
import type { Handler } from "@types";

import { Context } from "effect";

export class WindowHandler extends Context.Tag("WindowHandler")<WindowHandler, Handler<IPCRegistry, "window">>() {}
