import { App, Notice, PluginSettingTab, Setting, SecretComponent } from "obsidian";
import ImageHoistPlugin from "./main";
import { ConfirmationModal } from "./ui/modals/confirmation-modal";

export interface ImageHoistSettings {
	deleteAfterUpload: boolean;
	bulkUploadLimit: number;
	uploadCache: Record<string, string>;
	imgbbApiKey: string; // This stores the KEY NAME in SecretStorage
}

export const DEFAULT_SETTINGS: ImageHoistSettings = {
	deleteAfterUpload: false,
	bulkUploadLimit: 10,
	uploadCache: {},
	imgbbApiKey: "",
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

		containerEl.createEl("h2", { text: "Image Hoist Settings" });

		// API Key Setting using the native Secret Component
		new Setting(containerEl)
			.setName("ImgBB API key")
			.setDesc("Select the secret that contains your ImgBB API key from Obsidian's SecretStorage.")
			.addComponent((el) => 
				new SecretComponent(this.app, el)
					.setValue(this.plugin.settings.imgbbApiKey)
					.onChange(async (value) => {
						this.plugin.settings.imgbbApiKey = value;
						await this.plugin.saveSettings();
						
						// Get the actual secret value and update the processor
						const actualKey = this.app.secretStorage.getSecret(value) || "";
						this.plugin.processor.updateApiKey(actualKey);
					})
			);

		// Bulk Upload Limit
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

		// Delete After Upload Toggle
		new Setting(containerEl)
			.setName("Delete local image after upload")
			.setDesc("Automatically move the local image file to trash after a successful hoist.")
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.deleteAfterUpload)
					.onChange(async (value) => {
						this.plugin.settings.deleteAfterUpload = value;
						await this.plugin.saveSettings();
					}),
			);
		
		containerEl.createEl("h3", { text: "Maintenance" });

		new Setting(containerEl)
			.setName("Clear upload cache")
			.setDesc("Reset the local cache of uploaded images.")
			.addButton((btn) => 
				btn
					.setButtonText("Clear Cache")
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
