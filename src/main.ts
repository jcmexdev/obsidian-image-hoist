import { ImgBBUploaderAdapter } from "core/adapters/imgbb-uploader";
import { ObsidianVaultAdapter } from "core/adapters/obsidian-vault";
import { ImageProcessor } from "core/use-cases/image-processor";
import { Notice, Plugin } from "obsidian";
import { registerCommands } from "./commands";
import { registerContextMenu } from "./ui/context-menu";
import {
	DEFAULT_SETTINGS,
	ImageHoistSettings,
	ImageHoistSettingTab
} from "./settings";

export const API_KEY_SECRET = "obsidian-image-hoist-api-key";

export default class ImageHoistPlugin extends Plugin {
	settings: ImageHoistSettings;
	processor: ImageProcessor;
	vaultAdapter: ObsidianVaultAdapter;
	lastContextTarget: HTMLElement | null = null;

	async onload() {
		await this.loadSettings();
		this.addSettingTab(new ImageHoistSettingTab(this.app, this));

		this.vaultAdapter = new ObsidianVaultAdapter(this.app);
		
		this.registerDomEvent(document, "contextmenu", (evt: MouseEvent) => {
			this.lastContextTarget = evt.target as HTMLElement;
		}, { capture: true });

		const apiKey = this.app.secretStorage.getSecret(API_KEY_SECRET) || "";
		
		const uploaderAdapter = new ImgBBUploaderAdapter(apiKey);
		this.processor = new ImageProcessor(
			uploaderAdapter, 
			this.vaultAdapter,
			this.settings.uploadCache,
			async (hash, url) => {
				this.settings.uploadCache[hash] = url;
				await this.saveSettings();
			}
		);

		registerCommands(this, this.processor);
		registerContextMenu(this);

		if (!apiKey) {
			new Notice("Image Hoist: ImgBB API Key not found. Please set it in the plugin settings.");
		}
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			(await this.loadData()) as Partial<ImageHoistSettings>,
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
