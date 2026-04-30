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

/**
 * Main Obsidian Plugin class for Image Hoist.
 * Orchestrates settings, services, and event registration.
 */
export default class ImageHoistPlugin extends Plugin {
	settings: ImageHoistSettings;
	processor: ImageProcessor;
	vaultAdapter: ObsidianVaultAdapter;
	lastContextTarget: HTMLElement | null = null;

	async onload() {
		await this.loadSettings();
		this.addSettingTab(new ImageHoistSettingTab(this.app, this));

		// Core Services
		this.vaultAdapter = new ObsidianVaultAdapter(this.app);
		
		// Setup context menu target tracking
		this.registerDomEvent(document, "contextmenu", (evt: MouseEvent) => {
			this.lastContextTarget = evt.target as HTMLElement;
		}, { capture: true });

		// Initialize Uploader and Processor
		const apiKey = this.app.secretStorage.getSecret(this.settings.imgbbApiKey) || "";
		if (!apiKey) {
			new Notice("ImgBB API key is missing. Please configure it in the plugin settings.");
		}

		const uploaderAdapter = new ImgBBUploaderAdapter(apiKey);
		this.processor = new ImageProcessor(uploaderAdapter, this.vaultAdapter);

		// Feature Registration
		registerCommands(this, this.processor);
		registerContextMenu(this);
	}

	onunload() {
		// Obsidian handles automatic cleanup of registered events and commands
	}

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
