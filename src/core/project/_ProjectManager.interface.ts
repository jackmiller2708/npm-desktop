import { PlatformError } from "@effect/platform/Error";
import { ProjectInfo } from "@shared/project";
import { Context, Effect, Option } from "effect";
import { ParseError } from "effect/ParseResult";

export class ProjectManager extends Context.Tag("ProjectManager")<ProjectManager, {
  open: (path: string) => Effect.Effect<ProjectInfo, Error | PlatformError | ParseError>;
  getCurrent: () => Effect.Effect<Option.Option<ProjectInfo>>;
  listRecents: () => Effect.Effect<ReadonlyArray<ProjectInfo>, Error | PlatformError | ParseError>;
  close: () => Effect.Effect<void>;
}>() {}
