import type { Check } from "commonality";

import { diff, json } from "commonality";

export default {
	level: "error",
	message: 'Package must have a "typecheck" script in package.json',
	validate: async (context) => {
		const packageJson = await json(context.package.path, "package.json").get();

		if (!packageJson) {
			return {
				message: "package.json does not exist",
				path: "package.json",
			};
		}

		const scripts = packageJson["scripts"] as Record<string, unknown>;

		if (!scripts["typecheck"]) {
			return {
				message: 'package.json does not have a "typecheck" script',
				path: "package.json",
				suggestion: diff({ scripts }, { scripts: { ...scripts, typecheck: 'Typecheck command e.g. "tsc"' } }) ?? "",
			};
		}

		return true;
	},
} satisfies Check;
