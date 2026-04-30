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

export interface ProcessResult {
	link: string;
	isCacheHit: boolean;
}

export interface BatchResult {
	processedCount: number;
	cacheCount: number;
}

/**
 * Interface for uploaders that support dynamic API key updates.
 */
interface DynamicUploader extends ImageUploader {
	setApiKey(key: string): void;
}

export class ImageProcessor {
	constructor(
		private uploader: ImageUploader,
		private vault: VaultService,
		private cache: Record<string, string>,
		private onCacheUpdate: (hash: string, url: string) => Promise<void>,
	) {}

	/**
	 * Updates the API key if the uploader supports it.
	 */
	updateApiKey(key: string) {
		const dynamicUploader = this.uploader as Partial<DynamicUploader>;
		if (typeof dynamicUploader.setApiKey === "function") {
			dynamicUploader.setApiKey(key);
		}
	}

	async processImage(
		fileData: ArrayBuffer,
		fileName: string,
		altText = "",
	): Promise<ProcessResult> {
		const hash = await getContentHash(fileData);

		if (this.cache[hash]) {
			return {
				link: `![${altText}](${this.cache[hash]})`,
				isCacheHit: true
			};
		}

		const url = await this.uploader.upload(fileData, fileName);
		await this.onCacheUpdate(hash, url);
		
		return {
			link: `![${altText}](${url})`,
			isCacheHit: false
		};
	}

	async hoistSingleImage(
		notePath: string,
		image: ImageMetadata,
		deleteAfterUpload = false,
	): Promise<boolean> {
		const content = await this.vault.readFile(notePath);

		try {
			const data = await this.vault.readBinary(image.path);
			const result = await this.processImage(data, image.name, image.originalLink);

			const updatedContent = content.substring(0, image.start) + result.link + content.substring(image.end);

			await this.vault.writeFile(notePath, updatedContent);

			if (deleteAfterUpload) {
				await this.vault.deleteFile(image.path);
			}

			return result.isCacheHit;
		} catch (error) {
			throw new Error(`Failed to hoist image ${image.name}: ${String(error)}`);
		}
	}

	async hoistAllImages(
		notePath: string, 
		deleteAfterUpload = false,
		limit = 10
	): Promise<BatchResult> {
		const images = await this.vault.getImagesInFile(notePath);
		if (images.length === 0) return { processedCount: 0, cacheCount: 0 };

		const limitedImages = images.slice(0, limit);
		let content = await this.vault.readFile(notePath);

		const sortedImages = [...limitedImages].sort((a, b) => b.start - a.start);
		let processedCount = 0;
		let cacheCount = 0;

		for (const img of sortedImages) {
			try {
				const data = await this.vault.readBinary(img.path);
				const result = await this.processImage(data, img.name, img.originalLink);

				content = content.substring(0, img.start) + result.link + content.substring(img.end);

				if (deleteAfterUpload) {
					await this.vault.deleteFile(img.path);
				}

				processedCount++;
				if (result.isCacheHit) cacheCount++;
			} catch (error) {
				console.error(`Failed to process ${img.name}:`, error);
			}
		}

		if (processedCount > 0) {
			await this.vault.writeFile(notePath, content);
		}

		return { processedCount, cacheCount };
	}
}
