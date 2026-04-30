import { Editor, MarkdownView, Notice } from "obsidian";
import ImageHoistPlugin from "../main";
import { t } from "../i18n";

/**
 * Handles automatic image hoisting when pasting or dropping files into the editor.
 */
export function registerAutoHoistHandler(plugin: ImageHoistPlugin) {
	// Handle Paste
	plugin.registerEvent(
		plugin.app.workspace.on("editor-paste", async (evt: ClipboardEvent, editor: Editor, _view: MarkdownView) => {
			if (evt.defaultPrevented) return;
			if (!plugin.settings.autoHoist) return;
			
			const files = evt.clipboardData?.files;
			if (!files || files.length === 0) return;

			for (let i = 0; i < files.length; i++) {
				const file = files[i]!;
				if (file.type.startsWith("image/")) {
					evt.preventDefault();
					await handleFileAutoHoist(file, editor, plugin);
				}
			}
		})
	);

	// Handle Drop
	plugin.registerEvent(
		plugin.app.workspace.on("editor-drop", async (evt: DragEvent, editor: Editor, _view: MarkdownView) => {
			if (evt.defaultPrevented) return;
			if (!plugin.settings.autoHoist) return;

			const files = evt.dataTransfer?.files;
			if (!files || files.length === 0) return;

			for (let i = 0; i < files.length; i++) {
				const file = files[i]!;
				if (file.type.startsWith("image/")) {
					evt.preventDefault();
					await handleFileAutoHoist(file, editor, plugin);
				}
			}
		})
	);
}

/**
 * Common logic to upload a file and insert its link into the editor.
 */
async function handleFileAutoHoist(file: File, editor: Editor, plugin: ImageHoistPlugin) {
	new Notice(t("NOTICE_STARTING_SINGLE", { name: file.name }));
	
	try {
		const arrayBuffer = await file.arrayBuffer();
		const result = await plugin.processor.processImage(
			arrayBuffer,
			file.name,
			file.name
		);

		const cursor = editor.getCursor();
		editor.replaceRange(result.link, cursor);
		
		if (result.isCacheHit) {
			new Notice(t("NOTICE_SUCCESS_CACHE", { name: file.name }));
		} else {
			new Notice(t("NOTICE_SUCCESS_SINGLE", { name: file.name }));
		}
	} catch (error) {
		const msg = error instanceof Error ? error.message : String(error);
		new Notice(`Error: ${msg}`);
	}
}
