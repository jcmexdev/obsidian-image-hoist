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
	};
}

export class ImgBBUploaderAdapter implements ImageUploader {
	constructor(private apiKey: string) {}

	async upload(fileData: ArrayBuffer, fileName: string): Promise<string> {
		if (!this.apiKey) {
			throw new Error("API key is missing");
		}

		const base64Image = this.arrayBufferToBase64(fileData);

		const formData = new URLSearchParams();
		formData.append("image", base64Image);

		
		const response = await requestUrl({
			url: `https://api.imgbb.com/1/upload?key=${this.apiKey}`,
			method: "POST",
			contentType: "application/x-www-form-urlencoded",
			body: formData.toString(),
		});

		const json = response.json as ImgBBResponse;

		if (response.status !== 200) {
			throw new Error(`Upload failed: ${json.error?.message || response.text}`);
		}

		return json.data.url;
	}

	private arrayBufferToBase64(buffer: ArrayBuffer): string {
		let binary = "";
		const bytes = new Uint8Array(buffer);
		const len = bytes.byteLength;
		for (let i = 0; i < len; i++) {
			binary += String.fromCharCode(bytes[i]!);
		}
		return window.btoa(binary);
	}
}