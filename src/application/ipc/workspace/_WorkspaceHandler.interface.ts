import { Context } from "effect";
import { WorkspaceNamespace } from "./_WorkspaceNamespace";

export class WorkspaceHandler extends Context.Tag("WorkspaceHandler")<WorkspaceHandler, WorkspaceNamespace>() {}
