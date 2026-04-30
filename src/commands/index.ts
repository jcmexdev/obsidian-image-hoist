import { ImageProcessor } from "../core/use-cases/image-processor";
import ImageHoistPlugin from "../main";
import { hoistImagesInCurrentNote } from "./hoist-images";

export function registerCommands(plugin: ImageHoistPlugin, processor: ImageProcessor) {
    plugin.addCommand({
        id: "hoist-images-in-note",
        name: "Hoist all images in current note",
        callback: () => hoistImagesInCurrentNote(plugin, processor),
    });
}
