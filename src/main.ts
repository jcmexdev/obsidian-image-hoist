import { ImgBBUploaderAdapter } from "core/adapters/imgbb-uploader";
import { ObsidianVaultAdapter } from "core/adapters/obsidian-vault";
import { ImageProcessor } from "core/use-cases/image-processor";
import { Notice, Plugin } from "obsidian";
import { registerCommands } from "./commands";
import {
	DEFAULT_SETTINGS,
	ImageHoistSettings,
	ImageHoistSettingTab
} from "./settings";

export default class ImageHoistPlugin extends Plugin {
	settings: ImageHoistSettings;

	async onload() {
		await this.loadSettings();
		this.addSettingTab(new ImageHoistSettingTab(this.app, this));

		const vaultAdapter = new ObsidianVaultAdapter(this.app);

		// Fallback to settings if secretStorage is not yet populated
		const apiKey = this.settings.imgbbApiKey;
		
		if (!apiKey) {
			new Notice("ImgBB API key is missing. Please configure it in the plugin settings.");
			// We still register commands, but they might fail if the key is missing later
		}

		const uploaderAdapter = new ImgBBUploaderAdapter(apiKey);
		const processor = new ImageProcessor(uploaderAdapter, vaultAdapter);

		registerCommands(this, processor);
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
