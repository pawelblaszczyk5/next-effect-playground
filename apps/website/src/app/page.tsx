import { Effect } from "effect";

import { defineEffectComponent, ExampleService, noStore } from "#src/lib/effect.ts";

const HomeRoute = defineEffectComponent(({ searchParams }: { searchParams: Record<string, any> }) => {
	return Effect.gen(function* () {
		const exampleService = yield* ExampleService;
		const greeting = yield* exampleService.greet();

		yield* Effect.log(searchParams);

		yield* noStore;

		return <h1>{greeting}</h1>;
	});
});

export default HomeRoute;
