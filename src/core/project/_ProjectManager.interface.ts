import { PlatformError } from "@effect/platform/Error";
import { ProjectInfo } from "@shared/project";
import { Context, Effect, Option } from "effect";
import { ParseError } from "effect/ParseResult";

export class ProjectManager extends Context.Tag("ProjectManager")<ProjectManager, {
  open: (path: string) => Effect.Effect<ProjectInfo, Error | PlatformError | ParseError>;
  getCurrent: () => Effect.Effect<Option.Option<ProjectInfo>, Error | PlatformError>;
  listRecents: () => Effect.Effect<ReadonlyArray<ProjectInfo>, Error | PlatformError | ParseError>;
  clearRecents: () => Effect.Effect<void, Error | PlatformError>;
  close: () => Effect.Effect<void, Error | PlatformError>;
}>() {}
