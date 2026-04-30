import { MarkdownView, Notice } from "obsidian";
import { ImageProcessor } from "../core/use-cases/image-processor";
import ImageHoistPlugin from "../main";

export async function hoistImagesInCurrentNote(plugin: ImageHoistPlugin, processor: ImageProcessor) {
    const view = plugin.app.workspace.getActiveViewOfType(MarkdownView);
    if (!view) {
        new Notice("No active markdown note found.");
        return;
    }
}
