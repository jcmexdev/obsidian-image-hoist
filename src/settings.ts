import { App, PluginSettingTab, Setting } from "obsidian";
import ImageHoistPlugin from "./main";

export interface ImageHoistSettings {
	imgbbApiKey: string;
	deleteAfterUpload: boolean;
	bulkUploadLimit: number;
	uploadCache: Record<string, string>;
}

export const DEFAULT_SETTINGS: ImageHoistSettings = {
	imgbbApiKey: "",
	deleteAfterUpload: false,
	bulkUploadLimit: 10,
	uploadCache: {},
};

export class ImageHoistSettingTab extends PluginSettingTab {
	plugin: ImageHoistPlugin;

	constructor(app: App, plugin: ImageHoistPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		new Setting(containerEl)
			.setName("ImgBB API key")
			.setDesc("Enter your ImgBB API key")
			.addText((text) =>
				text
					.setPlaceholder("Enter your API key")
					.setValue(this.plugin.settings.imgbbApiKey)
					.onChange(async (value) => {
						this.plugin.settings.imgbbApiKey = value;
						await this.app.secretStorage.setSecret(this.plugin.settings.imgbbApiKey, value);
						await this.plugin.saveSettings();
					}),
			);

		new Setting(containerEl)
			.setName("Bulk upload limit")
			.setDesc("Maximum number of images to hoist per note (1-20)")
			.addSlider((slider) => 
				slider
					.setLimits(1, 20, 1)
					.setValue(this.plugin.settings.bulkUploadLimit)
					.setDynamicTooltip()
					.onChange(async (value) => {
						this.plugin.settings.bulkUploadLimit = value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Delete local image after upload")
			.setDesc("Move the local image file to trash after a successful hoist")
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.deleteAfterUpload)
					.onChange(async (value) => {
						this.plugin.settings.deleteAfterUpload = value;
						await this.plugin.saveSettings();
					}),
			);
		
		new Setting(containerEl)
			.setName("Clear upload cache")
			.setDesc("Reset the local cache of uploaded images.")
			.addButton((btn) => 
				btn
					.setButtonText("Clear Cache")
					.setWarning()
					.onClick(async () => {
						this.plugin.settings.uploadCache = {};
						await this.plugin.saveSettings();
						this.display();
					})
			);
	}
}
