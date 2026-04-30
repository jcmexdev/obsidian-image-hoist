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
	const obsidianLang = window.localStorage.getItem("language");
	const lang = (obsidianLang || moment.locale()).split("-")[0] || "en";
	
	const locale = locales[lang] || locales.en;
	
	const fallback = locales.en!;
	let text = (locale ? locale[key] : fallback[key]) || fallback[key] || key;

	Object.keys(vars).forEach((v) => {
		text = text.replace(`{{${v}}}`, String(vars[v]));
	});

	// Debug log to identify why it's not showing Spanish
	if (lang === "es" && text === fallback[key] && locale[key] === undefined) {
		console.debug(`Image Hoist i18n: Key "${key}" not found in "es" locale, falling back to "en".`);
	}

	return text;
}
