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

export class ImgBBUploaderAdapter implements ImageUploader {
	constructor(private apiKey: string) {}

	async upload(fileData: ArrayBuffer, fileName: string): Promise<string> {
		if (!this.apiKey || this.apiKey.trim() === "") {
			throw new Error("ImgBB API Key is empty. Please check your plugin settings.");
		}

		const base64Image = this.arrayBufferToBase64(fileData);

		try {
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
				// We prefer the direct image URL
				return data.data.url;
			} else {
				throw new Error(data?.error?.message || "Unknown API Error");
			}
		} catch (error) {
			if (error instanceof Error) throw error;
			throw new Error(`Upload failed: ${String(error)}`);
		}
	}

	private arrayBufferToBase64(buffer: ArrayBuffer): string {
		const bytes = new Uint8Array(buffer);
		let binary = "";
		for (let i = 0; i < bytes.byteLength; i++) {
			binary += String.fromCharCode(bytes[i]!);
		}
		return window.btoa(binary);
	}
}