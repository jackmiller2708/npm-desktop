/** biome-ignore-all lint/suspicious/noExplicitAny: generic type inference */

export type Params<T extends (...params: any) => any> = T extends (params: infer P) => any ? P : never;