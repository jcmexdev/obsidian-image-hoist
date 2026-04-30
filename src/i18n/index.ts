import { moment } from "obsidian";
import en from "./locales/en";
import es from "./locales/es";

const locales: { [key: string]: typeof en } = {
	en,
	es,
};

/**
 * Translation helper for the plugin.
 * Uses Obsidian's current language (via moment) or falls back to English.
 */
export function t(key: keyof typeof en, vars?: { [key: string]: string | number }): string {
	const lang = moment.locale();
	const locale = locales[lang] || locales.en;
	let text = locale[key] || locales.en[key] || key;

	if (vars) {
		Object.keys(vars).forEach((v) => {
			text = text.replace(`{{${v}}}`, String(vars[v]));
		});
	}

	return text;
}
