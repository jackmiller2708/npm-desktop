import type { IPCRegistry } from "@shared/ipc/registry";
import type { Handler } from "@types";

import { Context } from "effect";

export class NpmHandler extends Context.Tag("NpmHandler")<NpmHandler, Handler<IPCRegistry, "npm">>() {}
