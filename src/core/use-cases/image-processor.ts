import { ImageUploader } from '../ports/uploader';
import { VaultService } from '../ports/vault';

export class ImageProcessor {
    constructor(
        private uploader: ImageUploader,
        private vault: VaultService
    ) {}

    async processImage(fileData: ArrayBuffer, fileName: string, altText: string = ""): Promise<string> {
        const url = await this.uploader.upload(fileData, fileName);
        // Using the preserved altText which now contains original info like "imagen.png|100"
        return `![${altText}](${url})`;
    }

    async hoistAllImages(notePath: string, deleteAfterUpload: boolean = false): Promise<number> {
        const images = await this.vault.getImagesInFile(notePath);
        if (images.length === 0) return 0;

        let content = await this.vault.readFile(notePath);

        // Sort by start offset descending to avoid shifting issues
        const sortedImages = [...images].sort((a, b) => b.start - a.start);
        let processedCount = 0;

        for (const img of sortedImages) {
            try {
                const data = await this.vault.readBinary(img.path);
                // We pass the originalLink (e.g. "imagen.png|100")
                const newLink = await this.processImage(data, img.name, img.originalLink);

                // Precise replacement using offsets
                content = content.substring(0, img.start) + newLink + content.substring(img.end);
                
                if (deleteAfterUpload) {
                    await this.vault.deleteFile(img.path);
                }
                
                processedCount++;
            } catch (error) {
                console.error(`Failed to hoist image ${img.name}:`, error);
            }
        }

        if (processedCount > 0) {
            await this.vault.writeFile(notePath, content);
        }

        return processedCount;
    }
}
