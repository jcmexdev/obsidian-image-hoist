import { App, Notice, PluginSettingTab, SecretComponent, Setting } from "obsidian";
import { t } from "./i18n";
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

		new Setting(containerEl).setHeading().setName(t("SETTINGS_TITLE"));

		// API Key
		new Setting(containerEl)
			.setName(t("SETTINGS_API_KEY_NAME"))
			.setDesc(t("SETTINGS_API_KEY_DESC"))
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
			.setName(t("SETTINGS_AUTO_HOIST_NAME"))
			.setDesc(t("SETTINGS_AUTO_HOIST_DESC"))
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
			.setName(t("SETTINGS_BULK_LIMIT_NAME"))
			.setDesc(t("SETTINGS_BULK_LIMIT_DESC"))
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
			.setName(t("SETTINGS_DELETE_NAME"))
			.setDesc(t("SETTINGS_DELETE_DESC"))
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.deleteAfterUpload)
					.onChange(async (value) => {
						this.plugin.settings.deleteAfterUpload = value;
						await this.plugin.saveSettings();
					}),
			);
		
		new Setting(containerEl).setHeading().setName(t("SETTINGS_MAINTENANCE"));

		new Setting(containerEl)
			.setName(t("SETTINGS_CLEAR_CACHE_NAME"))
			.setDesc(t("SETTINGS_CLEAR_CACHE_DESC"))
			.addButton((btn) => 
				btn
					.setButtonText(t("SETTINGS_CLEAR_CACHE_BUTTON"))
					.setWarning()
					.onClick(() => {
						new ConfirmationModal(
							this.app,
							t("SETTINGS_CLEAR_CACHE_CONFIRM"),
							async () => {
								this.plugin.settings.uploadCache = {};
								await this.plugin.saveSettings();
								new Notice(t("NOTICE_CACHE_CLEARED"));
								this.display();
							},
							true
						).open();
					})
			);
	}
}
