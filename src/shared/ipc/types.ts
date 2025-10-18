/** biome-ignore-all lint/suspicious/noExplicitAny: This file is for type declarations. */

import type { ReadonlyRecord } from "effect/Record";

/**
 * Describes the shape of a single command contract.
 * Each command must define input/output types.
 */
export interface IPCCommandContract {
	input: unknown[];
	output: unknown;
}

/**
 * Describes the shape of a valid registry.
 * It’s a nested record of { namespace -> command -> IPCCommandContract }.
 */
export type IPCContractRegistry = ReadonlyRecord<
	string,
	ReadonlyRecord<string, IPCCommandContract>
>;

export type ExtractCommand<R> = {
	[N in keyof R & string]: {
		[C in keyof R[N] & string]: `${N}:${C}`;
	}[keyof R[N] & string];
}[keyof R & string];

/**
 * Internal helper type to flatten the registry into a
 * discriminated union like:
 * { channel: "npm:install"; input: [...]; output: ... }
 */
export type FlattenRegistry<R extends Record<string, Record<string, any>>> = {
	[NS in keyof R & string]: {
		[CMD in keyof R[NS] & string]: {
			channel: `${NS}:${CMD}`;
			input: R[NS][CMD]["input"];
			output: R[NS][CMD]["output"];
		};
	}[keyof R[NS] & string];
}[keyof R & string];

/**
 * Extract the input type for a specific channel
 */
export type ExtractInput<
	R extends Record<string, Record<string, any>>,
	C extends string,
> = Extract<FlattenRegistry<R>, { channel: C }> extends infer X
	? X extends { input: infer I }
		? I
		: never
	: never;

/**
 * Extract the output type for a specific channel
 */
export type ExtractOutput<
	R extends Record<string, Record<string, any>>,
	C extends string,
> = Extract<FlattenRegistry<R>, { channel: C }> extends infer X
	? X extends { output: infer O }
		? O
		: never
	: never;
