import { App, PluginSettingTab, Setting, SecretComponent } from "obsidian";
import ImageHoistPlugin from "./main";
import { ConfirmationModal } from "./ui/modals/confirmation-modal";

export interface ImageHoistSettings {
	deleteAfterUpload: boolean;
	bulkUploadLimit: number;
	uploadCache: Record<string, string>;
	imgbbApiKey: string;
	autoHoist: boolean;
}

export const DEFAULT_SETTINGS: ImageHoistSettings = {
	deleteAfterUpload: false,
	bulkUploadLimit: 10,
	uploadCache: {},
	imgbbApiKey: "",
	autoHoist: false,
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

		new Setting(containerEl).setHeading().setName("Image hoist settings");

		// API Key
		new Setting(containerEl)
			.setName("ImgBB API key")
			.setDesc("Select the secret for ImgBB API key.")
			.addComponent((el) => 
				new SecretComponent(this.app, el)
					.setValue(this.plugin.settings.imgbbApiKey)
					.onChange(async (value) => {
						this.plugin.settings.imgbbApiKey = value;
						await this.plugin.saveSettings();
						const actualKey = this.app.secretStorage.getSecret(value) || "";
						this.plugin.processor.updateApiKey(actualKey);
					})
			);

		// Auto Hoist Toggle
		new Setting(containerEl)
			.setName("Auto-hoist on paste or drag")
			.setDesc("Automatically upload images to ImgBB when pasting or dragging them into the editor.")
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.autoHoist)
					.onChange(async (value) => {
						this.plugin.settings.autoHoist = value;
						await this.plugin.saveSettings();
					}),
			);

		// Bulk Upload Limit
		new Setting(containerEl)
			.setName("Bulk upload limit")
			.setDesc("Maximum images to hoist per note (1-20)")
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

		// Delete After Upload
		new Setting(containerEl)
			.setName("Delete local image after upload")
			.setDesc("Move local file to trash after successful hoist.")
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.deleteAfterUpload)
					.onChange(async (value) => {
						this.plugin.settings.deleteAfterUpload = value;
						await this.plugin.saveSettings();
					}),
			);
		
		new Setting(containerEl).setHeading().setName("Maintenance");

		new Setting(containerEl)
			.setName("Clear upload cache")
			.setDesc("Reset the local cache of uploaded images.")
			.addButton((btn) => 
				btn
					.setButtonText("Clear cache")
					.setWarning()
					.onClick(() => {
						new ConfirmationModal(
							this.app,
							"Are you sure you want to clear the upload cache?",
							async () => {
								this.plugin.settings.uploadCache = {};
								await this.plugin.saveSettings();
								this.display();
							},
							true
						).open();
					})
			);
	}
}
