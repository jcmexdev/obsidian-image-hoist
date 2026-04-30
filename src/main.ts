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
	processor: ImageProcessor;
	vaultAdapter: ObsidianVaultAdapter;

	async onload() {
		await this.loadSettings();
		this.addSettingTab(new ImageHoistSettingTab(this.app, this));

		this.vaultAdapter = new ObsidianVaultAdapter(this.app);

		const apiKey = this.app.secretStorage.getSecret(this.settings.imgbbApiKey) || "";
		
		if (!apiKey) {
			new Notice("ImgBB API key is missing. Please configure it in the plugin settings.");
		}

		const uploaderAdapter = new ImgBBUploaderAdapter(apiKey);
		this.processor = new ImageProcessor(uploaderAdapter, this.vaultAdapter);

		registerCommands(this, this.processor);
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
