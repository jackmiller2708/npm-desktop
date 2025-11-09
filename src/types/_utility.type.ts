/** biome-ignore-all lint/suspicious/noExplicitAny: generic type inference */

import { RouteObject } from "react-router";

export type Params<T extends (...params: any) => any> = T extends (params: infer P, ) => any ? P : never;

type NormalizePath<P extends string> = P extends "" ? "" : P extends `/${string}` ? P : `/${P}`;
type JoinPath<Parent extends string, Child extends string> = Parent extends "" ? NormalizePath<Child> : Child extends "" ? Parent : `${Parent}/${Child}`;

export type RoutePaths<R extends readonly RouteObject[], Parent extends string = ""> = R extends readonly (infer Item)[]
	? Item extends RouteObject
		?
				|
				(Item extends { index: true }
						? Parent extends ""
							? "/"
							: Parent
						: Item extends { path: string }
							? JoinPath<Parent, Item["path"]>
							: never)
				| (Item extends { children: readonly RouteObject[] }
						? RoutePaths<
								Item["children"],
								Item extends { index: true }
									? Parent
									: Item extends { path: string }
										? JoinPath<Parent, Item["path"]>
										: Parent
							>
						: never)
		: never
	: never;
