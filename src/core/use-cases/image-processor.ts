import { ImageUploader } from "../ports/uploader";
import { VaultService } from "../ports/vault";
import { getContentHash } from "../../utils/crypto-utils";

export interface ImageMetadata {
	path: string;
	name: string;
	start: number;
	end: number;
	originalLink: string;
}

export class ImageProcessor {
	constructor(
		private uploader: ImageUploader,
		private vault: VaultService,
		private cache: Record<string, string>,
		private onCacheUpdate: (hash: string, url: string) => Promise<void>,
	) {}

	async processImage(
		fileData: ArrayBuffer,
		fileName: string,
		altText = "",
	): Promise<string> {
		const hash = await getContentHash(fileData);

		if (this.cache[hash]) {
			return `![${altText}](${this.cache[hash]})`;
		}

		const url = await this.uploader.upload(fileData, fileName);
		
		await this.onCacheUpdate(hash, url);
		
		return `![${altText}](${url})`;
	}

	async hoistSingleImage(
		notePath: string,
		image: ImageMetadata,
		deleteAfterUpload = false,
	): Promise<void> {
		let content = await this.vault.readFile(notePath);

		try {
			const data = await this.vault.readBinary(image.path);
			const newLink = await this.processImage(data, image.name, image.originalLink);

			content = content.substring(0, image.start) + newLink + content.substring(image.end);

			await this.vault.writeFile(notePath, content);

			if (deleteAfterUpload) {
				await this.vault.deleteFile(image.path);
			}
		} catch (error) {
			throw new Error(`Failed to hoist image ${image.name}: ${String(error)}`);
		}
	}

	async hoistAllImages(notePath: string, deleteAfterUpload = false): Promise<number> {
		const images = await this.vault.getImagesInFile(notePath);
		if (images.length === 0) return 0;

		let content = await this.vault.readFile(notePath);
		const sortedImages = [...images].sort((a, b) => b.start - a.start);
		let processedCount = 0;

		for (const img of sortedImages) {
			try {
				const data = await this.vault.readBinary(img.path);
				const newLink = await this.processImage(data, img.name, img.originalLink);

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
