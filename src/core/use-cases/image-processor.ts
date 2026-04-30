import { ImageUploader } from '../ports/uploader';
import { VaultService } from '../ports/vault';

export class ImageProcessor {
    constructor(
        private uploader: ImageUploader,
        private vault: VaultService
    ) {}

    async processImage(fileData: ArrayBuffer, fileName: string): Promise<string> {
        const url = await this.uploader.upload(fileData, fileName);
        return `![](${url})`;
    }
}
