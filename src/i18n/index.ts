import { moment, getLanguage } from "obsidian";
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
	const obsidianLang = getLanguage();
	const lang = (obsidianLang || moment.locale()).split("-")[0] || "en";
	
	const locale = locales[lang] || locales.en;
	const fallback = locales.en!;
	
	let text = (locale ? locale[key] : fallback[key]) || fallback[key] || key;

	Object.keys(vars).forEach((v) => {
		text = text.replace(`{{${v}}}`, String(vars[v]));
	});

	return text;
}
