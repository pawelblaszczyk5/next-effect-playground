import type { Check } from "commonality";

import { diff, json } from "commonality";

export const hasPackageJsonField = (name: string) => {
	return {
		level: "error",
		message: `Package must have a "${name}" field in package.json`,
		validate: async (context) => {
			const packageJson = await json(context.package.path, "package.json").get();

			if (!packageJson) {
				return {
					message: "package.json does not exist",
					path: "package.json",
				};
			}

			const fieldValue = packageJson[name];

			if (typeof fieldValue !== "string" || fieldValue.length === 0) {
				return {
					message: `package.json doesn't have a "${name}" field`,
					path: "package.json",
					suggestion: diff({ [name]: packageJson[name] }, { [name]: `Your "${name}" field value` }) ?? "",
				};
			}

			return true;
		},
	} satisfies Check;
};
