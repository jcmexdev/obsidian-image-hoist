import { App, Notice, PluginSettingTab, SecretComponent, Setting } from "obsidian";
import ImgHoistPlugin from "./main";

export interface ImageHoistSettings {
	imgbbApiKey: string;
	deleteAfterUpload: boolean;
	bulkUploadLimit: number;
	uploadCache: Record<string, string>;
}

export const DEFAULT_SETTINGS: ImageHoistSettings = {
	imgbbApiKey: "",
	deleteAfterUpload: true,
	bulkUploadLimit: 10,
	uploadCache: {},
};

export class ImageHoistSettingTab extends PluginSettingTab {
	plugin: ImgHoistPlugin;

	constructor(app: App, plugin: ImgHoistPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName("ImgBB API key")
			.setDesc("Select or create a secret from SecretStorage")
			.addComponent((el) => {
				return new SecretComponent(this.app, el)
					.setValue(this.plugin.settings.imgbbApiKey)
					.onChange(async (value) => {
						this.plugin.settings.imgbbApiKey = value;
						await this.plugin.saveSettings();
					});
			});

		new Setting(containerEl)
			.setName("Bulk upload limit")
			.setDesc(
				"Maximum images per batch upload. Default is 10 (max 20).",
			)
			.addText((text) =>
				text
					.setPlaceholder("5")
					.setValue(this.plugin.settings.bulkUploadLimit.toString())
					.onChange(async (value) => {
						const num = parseInt(value);
						if (!isNaN(num)) {
							this.plugin.settings.bulkUploadLimit = Math.min(
								20,
								Math.max(1, num),
							);
							await this.plugin.saveSettings();
						}
					}),
			);
		new Setting(containerEl)
			.setName("Delete local file after upload")
			.setDesc(
				"Dangerous: automatically move the vault image to trash after a successfully upload. Use with caution!",
			)
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
			.setDesc(
				"Forgot which images have been uploaded. This will force re-uploading if the same image is encountered again.",
			)
			.addButton((button) => {
				button
					.setButtonText("Clear cache")
					.setWarning()
					.onClick(async () => {
						this.plugin.settings.uploadCache = {};
						await this.plugin.saveSettings();
						new Notice("Upload cache cleared");
					});
			});
	}
}
