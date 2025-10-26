import { Context } from "effect";
import { NpmNamespace } from "./_NpmNamespace";

export class NpmHandler extends Context.Tag("NpmHandler")<NpmHandler, NpmNamespace>() {}
