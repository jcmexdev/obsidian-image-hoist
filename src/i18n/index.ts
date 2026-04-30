import { moment } from "obsidian";
import en from "./locales/en";
import es from "./locales/es";

const locales: Record<string, typeof en> = {
	en,
	es,
};

/**
 * Translation helper for the plugin.
 */
export function t(key: keyof typeof en, vars?: { [key: string]: string | number }): string {
	const lang = moment.locale();
	const locale = locales[lang] || locales.en;
	
	// Safety check to ensure we always have a string
	let text: string = (locale as any)[key] || (locales.en as any)[key] || key;

	if (vars) {
		Object.keys(vars).forEach((v) => {
			text = text.replace(`{{${v}}}`, String(vars[v]));
		});
	}

	return text;
}
