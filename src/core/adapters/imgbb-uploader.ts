import { requestUrl } from "obsidian";
import { ImageUploader } from "../ports/uploader";

interface ImgBBResponse {
	data: {
		url: string;
	};
	success: boolean;
	status: number;
	error?: {
		message: string;
		code: number;
	};
}

/**
 * ImgBB implementation of the ImageUploader.
 * Uploads images to ImgBB API using x-www-form-urlencoded base64 data.
 */
export class ImgBBUploaderAdapter implements ImageUploader {
	constructor(private apiKey: string) {}

	async upload(fileData: ArrayBuffer, fileName: string): Promise<string> {
		if (!this.apiKey || this.apiKey.trim() === "") {
			throw new Error("ImgBB API Key is missing. Please check your plugin settings.");
		}

		// Convert ArrayBuffer to Base64 (Vanilla approach)
		const base64Image = this.arrayBufferToBase64(fileData);

		try {
			// Using the structure proven to work with ImgBB and Obsidian requestUrl
			const response = await requestUrl({
				url: "https://api.imgbb.com/1/upload",
				method: "POST",
				contentType: "application/x-www-form-urlencoded",
				body: new URLSearchParams({
					key: this.apiKey,
					image: base64Image,
					name: fileName.replace(/\s+/g, "_"),
				}).toString(),
			});

			const data = response.json as ImgBBResponse;
			if (data && data.success) {
				// data.data.url contains the direct link to the image
				return data.data.url;
			} else {
				throw new Error(data?.error?.message || "Unknown ImgBB API Error");
			}
		} catch (error) {
			if (error instanceof Error) throw error;
			throw new Error(`Upload failed: ${String(error)}`);
		}
	}

	/**
	 * Helper to convert binary data to base64 string without external dependencies.
	 */
	private arrayBufferToBase64(buffer: ArrayBuffer): string {
		const bytes = new Uint8Array(buffer);
		let binary = "";
		for (let i = 0; i < bytes.byteLength; i++) {
			binary += String.fromCharCode(bytes[i]!);
		}
		return window.btoa(binary);
	}
}