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
		console.debug(`Image Hoist: Processing ${fileName} with hash ${hash}`);

		if (this.cache[hash]) {
			console.debug(`Image Hoist: Cache hit for ${fileName}. URL: ${this.cache[hash]}`);
			return `![${altText}](${this.cache[hash]})`;
		}

		console.debug(`Image Hoist: Cache miss for ${fileName}, uploading to ImgBB...`);
		const url = await this.uploader.upload(fileData, fileName);
		
		await this.onCacheUpdate(hash, url);
		console.debug(`Image Hoist: Upload success for ${fileName}. New URL: ${url}`);
		
		return `![${altText}](${url})`;
	}

	async hoistSingleImage(
		notePath: string,
		image: ImageMetadata,
		deleteAfterUpload = false,
	): Promise<void> {
		const content = await this.vault.readFile(notePath);

		try {
			const data = await this.vault.readBinary(image.path);
			const newLink = await this.processImage(data, image.name, image.originalLink);

			const updatedContent = content.substring(0, image.start) + newLink + content.substring(image.end);

			await this.vault.writeFile(notePath, updatedContent);

			if (deleteAfterUpload) {
				await this.vault.deleteFile(image.path);
			}
		} catch (error) {
			console.error(`Image Hoist Error [Single]:`, error);
			throw new Error(`Failed to hoist image ${image.name}: ${String(error)}`);
		}
	}

	async hoistAllImages(
		notePath: string, 
		deleteAfterUpload = false,
		limit = 10
	): Promise<number> {
		const images = await this.vault.getImagesInFile(notePath);
		console.debug(`Image Hoist: Found ${images.length} images in file. Limit is ${limit}.`);
		
		if (images.length === 0) return 0;

		const limitedImages = images.slice(0, limit);
		let content = await this.vault.readFile(notePath);

		const sortedImages = [...limitedImages].sort((a, b) => b.start - a.start);
		console.debug(`Image Hoist: Starting batch processing of ${sortedImages.length} images.`);
		
		let processedCount = 0;

		for (const img of sortedImages) {
			try {
				console.debug(`Image Hoist: Reading binary for ${img.path}`);
				const data = await this.vault.readBinary(img.path);
				
				console.debug(`Image Hoist: Processing image logic for ${img.name}`);
				const newLink = await this.processImage(data, img.name, img.originalLink);

				console.debug(`Image Hoist: Replacing text at ${img.start}-${img.end}`);
				content = content.substring(0, img.start) + newLink + content.substring(img.end);

				if (deleteAfterUpload) {
					await this.vault.deleteFile(img.path);
				}

				processedCount++;
			} catch (error) {
				console.error(`Image Hoist: Failed to process ${img.name}:`, error);
			}
		}

		if (processedCount > 0) {
			console.debug(`Image Hoist: Writing updated content to ${notePath}`);
			await this.vault.writeFile(notePath, content);
		}

		return processedCount;
	}
}
