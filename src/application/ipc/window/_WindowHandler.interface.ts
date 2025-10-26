import { Context } from "effect";
import { WindowNamespace } from "./_WindowNamespace";

export class WindowHandler extends Context.Tag("WindowHandler")<WindowHandler, WindowNamespace>() {}
