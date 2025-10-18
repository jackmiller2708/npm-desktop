/** biome-ignore-all lint/suspicious/noExplicitAny: for generic type inference */

import { Data } from "effect";

type ResponseDataEnum<Success, Failure> = {
	Success: { data: Success };
	Failure: { reason: Failure };
};

export type RemoteData<Success = any, Failure = any> = Data.TaggedEnum<ResponseDataEnum<Success, Failure>>;

// Extend TaggedEnum.WithGenerics to add generics
interface RemoteDataDefinition extends Data.TaggedEnum.WithGenerics<2> {
	readonly taggedEnum: RemoteData<this["A"], this["B"]>;
}

const { Failure, Success } = Data.taggedEnum<RemoteDataDefinition>();

export { Failure, Success };
