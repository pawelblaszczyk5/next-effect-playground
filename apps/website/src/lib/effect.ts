import type { ReactNode } from "react";

import { Cause, Context, Data, Effect, Either, Exit, Layer, Logger, ManagedRuntime } from "effect";
import { unstable_noStore } from "next/cache";
import { unstable_rethrow } from "next/navigation";

const makeExampleServiceLive = () => {
	return {
		greet: (name?: string) => {
			return Effect.gen(function* () {
				if (name) {
					return `Hello ${name}!`;
				}

				yield* Effect.log("Anonymous user visited!");

				return "Hello stranger!";
			});
		},
	};
};

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions -- prevent intellisense expanding
export interface ExampleService extends ReturnType<typeof makeExampleServiceLive> {}

export const ExampleService = Context.GenericTag<ExampleService>("@repo/website#ExampleService");

export const ExampleServiceLive = Layer.succeed(ExampleService, makeExampleServiceLive());

const AppLayer = Layer.mergeAll(Logger.pretty, ExampleServiceLive);

const runtime = ManagedRuntime.make(AppLayer);

type AppEnvironment = Layer.Layer.Success<typeof AppLayer>;

class NextInternalError extends Data.TaggedError("NextInternalError")<{ cause: unknown }> {}

export const noStore = Effect.try({
	catch: (cause) => {
		return new NextInternalError({ cause });
	},
	try: () => {
		unstable_noStore();
	},
});

export const defineEffectComponent = <
	Props extends Readonly<Record<string, any>> | undefined = undefined,
	Return extends ReactNode = ReactNode,
>(
	component: (props: Props) => Effect.Effect<Return, NextInternalError, AppEnvironment>,
) => {
	return async (props: Props) => {
		const program = component(props);
		const result = await runtime.runPromiseExit(program);

		if (Exit.isSuccess(result)) {
			return result.value;
		}

		return result.cause.pipe(
			Cause.failureOrCause,
			Either.match({
				onLeft: (failure) => {
					unstable_rethrow(failure.cause);
					throw new Error("Unexpected error");
				},
				onRight: () => {
					throw new Error("Unexpected error");
				},
			}),
		);
	};
};
