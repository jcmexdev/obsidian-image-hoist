import { MarkdownView, Notice, TFile } from "obsidian";
import { ImageProcessor } from "../core/use-cases/image-processor";
import ImageHoistPlugin from "../main";
import { ConfirmationModal } from "../ui/modals/confirmation-modal";

export async function hoistImagesInCurrentNote(plugin: ImageHoistPlugin, processor: ImageProcessor) {
    const view = plugin.app.workspace.getActiveViewOfType(MarkdownView);
    if (!view || !(view.file instanceof TFile)) {
        new Notice("No active markdown note found.");
        return;
    }

    const noteFile = view.file;
    
    // Using the vaultAdapter stored in the plugin to get images
    const images = await plugin.vaultAdapter.getImagesInFile(noteFile.path);
    const imageCount = images.length;

    if (imageCount === 0) {
        new Notice("No local images found in this note.");
        return;
    }

    new ConfirmationModal(
        plugin.app,
        `Found ${imageCount} local images. Do you want to upload them to ImgBB and replace links?${plugin.settings.deleteAfterUpload ? " (Local files will be moved to trash)" : ""}`,
        async () => {
            new Notice(`Starting upload of ${imageCount} images...`);
            try {
                const processed = await processor.hoistAllImages(
                    noteFile.path, 
                    plugin.settings.deleteAfterUpload
                );
                new Notice(`Successfully hoisted ${processed} images!`);
            } catch (error) {
                new Notice("Error during hoisting process. Check console for details.");
                console.error(error);
            }
        }
    ).open();
}
