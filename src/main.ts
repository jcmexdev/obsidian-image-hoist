import { Plugin } from "obsidian";
import {
	DEFAULT_SETTINGS,
	ImgHoistSettings,
	ImgHoistSettingTab
} from "./settings";

export default class ImgHoistPlugin extends Plugin {
	settings: ImgHoistSettings;

	async onload() {
		await this.loadSettings();
		this.addSettingTab(new ImgHoistSettingTab(this.app, this));
	}

	onunload() {}
	

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			(await this.loadData()) as Partial<ImgHoistSettings>,
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
