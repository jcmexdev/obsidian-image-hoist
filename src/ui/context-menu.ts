import { Editor, MarkdownView, Menu, Notice, TFile } from "obsidian";
import ImageHoistPlugin from "../main";
import { ConfirmationModal } from "./modals/confirmation-modal";
import { t } from "../i18n";
import { extractOriginalLink } from "../utils/markdown-utils";

export function registerContextMenu(plugin: ImageHoistPlugin) {
	plugin.registerEvent(
		plugin.app.workspace.on("editor-menu", (menu: Menu, editor: Editor, view: MarkdownView) => {
			if (!(view.file instanceof TFile)) return;

			let foundImageLink = "";
			let imageEmbed = null;

			// 1. DOM detection
			const target = plugin.lastContextTarget;
			if (target) {
				if (target.tagName === "IMG") {
					foundImageLink = target.getAttribute("src") || "";
				} else {
					const imgInParent = target.querySelector("img");
					if (imgInParent) {
						foundImageLink = imgInParent.getAttribute("src") || "";
					}
				}
			}

			const cache = plugin.app.metadataCache.getFileCache(view.file);
			const localImages = [];

			if (cache?.embeds) {
				// Filter local images only for the "Hoist All" option
				for (const embed of cache.embeds) {
					if (!embed.link.startsWith("http://") && !embed.link.startsWith("https://")) {
						const imageFile = plugin.app.metadataCache.getFirstLinkpathDest(embed.link, view.file.path);
						if (imageFile instanceof TFile) {
							localImages.push(embed);
						}
					}
				}

				if (foundImageLink) {
					// Only proceed if it's not a remote link
					if (!foundImageLink.startsWith("http://") && !foundImageLink.startsWith("https://")) {
						const cleanPath = foundImageLink.replace(/^(app|capacitor):\/\/[^/]+\//, "");
						const decodedPath = decodeURI(cleanPath);

						imageEmbed = cache.embeds.find(
							(e) => e.link === decodedPath || decodedPath.endsWith(e.link),
						);
					}
				}

				// Fallback to cursor position
				if (!imageEmbed) {
					const offset = editor.posToOffset(editor.getCursor());
					imageEmbed = localImages.find(
						(e) => offset >= e.position.start.offset && offset <= e.position.end.offset,
					);
				}
			}

			// Individual option: only if a local image is selected/clicked
			if (imageEmbed) {
				const currentEmbed = imageEmbed;
				const imageFile = plugin.app.metadataCache.getFirstLinkpathDest(
					currentEmbed.link,
					view.file.path,
				);

				if (imageFile instanceof TFile) {
					menu.addItem((item) => {
						item.setTitle(t("CONTEXT_MENU_HOIST_SINGLE"))
							.setIcon("upload-cloud")
							.onClick(async () => {
								const processAction = async () => {
									new Notice(t("NOTICE_STARTING_SINGLE", { name: imageFile.name }));
									try {
										await plugin.processor.hoistSingleImage(
											view.file!.path,
											{
												path: imageFile.path,
												name: imageFile.name,
												start: currentEmbed.position.start.offset,
												end: currentEmbed.position.end.offset,
												originalLink: extractOriginalLink(currentEmbed.original),
											},
											plugin.settings.deleteAfterUpload,
										);
										new Notice(t("NOTICE_SUCCESS_SINGLE", { name: imageFile.name }));
									} catch (error) {
										new Notice(t("NOTICE_ERROR_SINGLE", { name: imageFile.name }));
										console.error("Image Hoist Error:", error);
									}
								};

								if (plugin.settings.deleteAfterUpload) {
									new ConfirmationModal(
										plugin.app,
										t("MODAL_CONFIRM_SINGLE", { name: imageFile.name }),
										processAction,
									).open();
								} else {
									await processAction();
								}
							});
					});
				}
			}

			// Global option: only if there is at least one local image in the note
			if (localImages.length > 0) {
				menu.addItem((item) => {
					item.setTitle(t("CONTEXT_MENU_HOIST_ALL"))
						.setIcon("layers")
						.onClick(async () => {
							const processAllAction = async () => {
								new Notice(t("NOTICE_STARTING_ALL", { count: localImages.length }));
								try {
									const count = await plugin.processor.hoistAllImages(
										view.file!.path,
										plugin.settings.deleteAfterUpload,
										plugin.settings.bulkUploadLimit
									);
									new Notice(t("NOTICE_SUCCESS_ALL", { count }));
								} catch (error) {
									new Notice(t("NOTICE_ERROR_ALL"));
									console.error("Image Hoist Error:", error);
								}
							};

							if (plugin.settings.deleteAfterUpload) {
								new ConfirmationModal(
									plugin.app,
									t("MODAL_CONFIRM_ALL", {
										count: localImages.length,
										trash: t("MODAL_TRASH_WARNING"),
									}),
									processAllAction,
								).open();
							} else {
								await processAllAction();
							}
						});
				});
			}
		}),
	);
}

