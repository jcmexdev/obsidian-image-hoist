import { ImageUploader } from "../ports/uploader";
import { VaultService } from "../ports/vault";

export interface ImageMetadata {
	path: string;
	name: string;
	start: number;
	end: number;
	originalLink: string;
}

/**
 * Core business logic for processing and hoisting images.
 * Decoupled from Obsidian APIs via VaultService and ImageUploader ports.
 */
export class ImageProcessor {
	constructor(
		private uploader: ImageUploader,
		private vault: VaultService,
	) {}

	/**
	 * Uploads a single image and returns the markdown link representation.
	 */
	async processImage(
		fileData: ArrayBuffer,
		fileName: string,
		altText = "",
	): Promise<string> {
		const url = await this.uploader.upload(fileData, fileName);
		// Preserves the altText which might contain original filename and dimensions
		return `![${altText}](${url})`;
	}

	/**
	 * Hoists a single image at a specific location in a note.
	 */
	async hoistSingleImage(
		notePath: string,
		image: ImageMetadata,
		deleteAfterUpload = false,
	): Promise<void> {
		let content = await this.vault.readFile(notePath);

		try {
			const data = await this.vault.readBinary(image.path);
			const newLink = await this.processImage(data, image.name, image.originalLink);

			// Precise string replacement based on offsets
			content = content.substring(0, image.start) + newLink + content.substring(image.end);

			await this.vault.writeFile(notePath, content);

			if (deleteAfterUpload) {
				await this.vault.deleteFile(image.path);
			}
		} catch (error) {
			throw new Error(`Failed to hoist image ${image.name}: ${String(error)}`);
		}
	}

	/**
	 * Hoists all local images found in a note.
	 * Replaces them in reverse order to ensure offsets remain valid during processing.
	 */
	async hoistAllImages(notePath: string, deleteAfterUpload = false): Promise<number> {
		const images = await this.vault.getImagesInFile(notePath);
		if (images.length === 0) return 0;

		let content = await this.vault.readFile(notePath);

		// Important: sort by start offset descending to avoid shifting the content 
		// while we replace multiple instances of text.
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
