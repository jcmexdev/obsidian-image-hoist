import { moment } from "obsidian";
import en from "./locales/en";
import es from "./locales/es";

// Define a type for our translation keys
type LocaleType = typeof en;

const locales: Record<string, LocaleType> = {
	en,
	es,
};

/**
 * Translation helper for the plugin.
 */
export function t(key: keyof LocaleType, vars: Record<string, string | number> = {}): string {
	const lang = moment.locale();
	const locale = locales[lang] || locales.en;
	
	let text = locale![key] || locales.en[key] || key;

	Object.keys(vars).forEach((v) => {
		text = text.replace(`{{${v}}}`, String(vars[v]));
	});

	return text;
}
