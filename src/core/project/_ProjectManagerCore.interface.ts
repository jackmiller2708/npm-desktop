import type { PlatformError } from "@effect/platform/Error";
import type { ProjectInfo } from "@shared/project";
import { Context } from "effect";
import type { Effect } from "effect/Effect";
import type { ParseError } from "effect/ParseResult";

export class ProjectManagerCore extends Context.Tag("ProjectManagerCore")<ProjectManagerCore, {
  loadRecents: (path: string) => Effect<ReadonlyArray<ProjectInfo>, Error | PlatformError | ParseError>,
  saveRecents: (path: string, recents: ReadonlyArray<ProjectInfo>) => Effect<void, PlatformError>,
}>() {}