import { ImgBBUploaderAdapter } from "core/adapters/imgbb-uploader";
import { ObsidianVaultAdapter } from "core/adapters/obsidian-vault";
import { ImageProcessor } from "core/use-cases/image-processor";
import { Plugin } from "obsidian";
import { registerCommands } from "./commands";
import { registerContextMenu } from "./ui/context-menu";
import { registerAutoHoistHandler } from "./ui/auto-hoist-handler";
import {
	DEFAULT_SETTINGS,
	ImageHoistSettings,
	ImageHoistSettingTab
} from "./settings";

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

		// 1. Get the Secret ID from settings
		const secretId = this.settings.imgbbApiKey;
		
		// 2. Retrieve the actual key from SecretStorage using that ID
		const apiKey = secretId ? (this.app.secretStorage.getSecret(secretId) || "") : "";
		
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
		registerAutoHoistHandler(this);

		// Minimal logging on startup, no intrusive Notices
		if (!apiKey) {
			console.debug("Image Hoist: API Key not set. Features will be available but uploads will prompt for configuration.");
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
