import { MarkdownView, Notice, TFile } from "obsidian";
import { ImageProcessor } from "../core/use-cases/image-processor";
import ImageHoistPlugin from "../main";
import { ConfirmationModal } from "../ui/modals/confirmation-modal";
import { t } from "../i18n";

/**
 * Command handler to hoist all images in the currently active note.
 */
export async function hoistImagesInCurrentNote(plugin: ImageHoistPlugin, processor: ImageProcessor) {
	const view = plugin.app.workspace.getActiveViewOfType(MarkdownView);
	if (!view || !(view.file instanceof TFile)) {
		new Notice(t("NOTICE_NO_MARKDOWN"));
		return;
	}

	const noteFile = view.file;
	const images = await plugin.vaultAdapter.getImagesInFile(noteFile.path);
	const imageCount = images.length;

	if (imageCount === 0) {
		new Notice(t("NOTICE_NO_IMAGES"));
		return;
	}

	const confirmMessage = t("MODAL_CONFIRM_ALL", {
		count: imageCount,
		trash: plugin.settings.deleteAfterUpload ? t("MODAL_TRASH_WARNING") : "",
	});

	new ConfirmationModal(
		plugin.app,
		confirmMessage,
		async () => {
			new Notice(t("NOTICE_STARTING_ALL", { count: imageCount }));
			try {
				const result = await processor.hoistAllImages(
					noteFile.path,
					plugin.settings.deleteAfterUpload,
					plugin.settings.bulkUploadLimit
				);
				
				if (result.cacheCount > 0) {
					new Notice(t("NOTICE_SUCCESS_ALL_CACHE", { 
						count: result.processedCount, 
						cacheCount: result.cacheCount 
					}));
				} else {
					new Notice(t("NOTICE_SUCCESS_ALL", { count: result.processedCount }));
				}
			} catch (error) {
				const msg = error instanceof Error ? error.message : String(error);
				new Notice(`Error: ${msg}`);
				console.error("Image Hoist Error:", error);
			}
		}
	).open();
}
