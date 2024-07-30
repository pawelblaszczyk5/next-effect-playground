import core from "@repo/eslint-config/core";
import drizzle from "@repo/eslint-config/drizzle";
import next from "@repo/eslint-config/next";
import node from "@repo/eslint-config/node";
import react from "@repo/eslint-config/react";

export default [
	{
		languageOptions: {
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname,
			},
		},
	},
	...core,
	...next,
	...drizzle,
	...node,
	...react,
	{
		files: ["**/{layout,page,template,default,not-found}.tsx"],
		rules: {
			"import-x/no-default-export": "off",
			"react-refresh/only-export-components": "off",
		},
	},
	{
		files: ["next.config.ts"],
		rules: {
			"import-x/no-default-export": "off",
		},
	},
];
