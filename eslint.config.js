import obsidianmd from "eslint-plugin-obsidianmd";
import globals from "globals";
import tseslint from 'typescript-eslint';

export default tseslint.config(
	{
		languageOptions: {
			globals: {
				...globals.browser,
			},
		},
	},
	{
		ignores: [
			"node_modules",
			"dist",
			"esbuild.config.mjs",
			"eslint.config.js",
			"version-bump.mjs",
			"versions.json",
			"main.js",
			"package-lock.json",
		],
	},
	// Obsidian recommended configs
	...obsidianmd.configs.recommended,
	...obsidianmd.configs.recommendedWithLocalesEn,
	// TypeScript recommended and typed rules
	...tseslint.configs.recommendedTypeChecked.map(config => ({
		...config,
		files: ["**/*.ts"],
	})),
	{
		files: ["**/*.ts"],
		languageOptions: {
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname,
			},
		},
		rules: {
			"@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
			"@typescript-eslint/require-await": "error",
			"obsidianmd/ui/sentence-case": ["error", {
				"brands": ["ImgBB", "Markdown", "Obsidian", "SecretStorage", "Image Hoist"],
				"acronyms": ["API"]
			}],
			"obsidianmd/ui/sentence-case-locale-module": ["error", {
				"brands": ["ImgBB", "Markdown", "Obsidian", "SecretStorage", "Image Hoist"],
				"acronyms": ["API"]
			}]
		}
	},
);
