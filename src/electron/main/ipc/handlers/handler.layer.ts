import { Layer } from "effect";
import { NpmHandlerLive } from "./npm-handler/_NpmHandler";

export const HandlerLayer = Layer.mergeAll(NpmHandlerLive);
