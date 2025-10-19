import { CommandExecutor } from "@core/execution";
import { Effect, Option } from "effect";
import { describe, expect, it } from "vitest";
import { ShellExecutorLive } from "./_ShellExecutor.live";

describe("ShellExecutor", () => {
	it("runs node --version successfully", async () => {
		const result = await Effect.runPromise(
			CommandExecutor.pipe(
				Effect.andThen((executor) => executor.execute("node", ["--version"])),
				Effect.provide(ShellExecutorLive),
			),
		);

		expect(result.exitCode).toEqual(Option.some(0));
		expect(result.stdout).toMatch(/^v\d/);
	});
});