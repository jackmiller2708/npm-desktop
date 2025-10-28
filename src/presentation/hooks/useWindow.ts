import { Effect, Either, Logger, Match } from "effect";

export function useWindow() {
  return {
    showOpenDialog: () => Effect.Do.pipe(
      Effect.andThen(() => Effect.promise(() => window.ipc.invoke("window:showOpenDialog"))),
      Effect.andThen((res) => Match.value(res).pipe(
        Match.tag('Success', ({ data }) => Effect.succeed(data)),
        Match.tag('Failure', ({ reason }) => Effect.fail(new Error(reason))),
        Match.exhaustive
      )),
      Effect.either,
      Effect.tap(Either.match({
        onRight: (data) => Effect.log(data),
        onLeft: (error) => Effect.logError(error.message)
      })),
      Effect.provide(Logger.pretty)
    )
  }
}
