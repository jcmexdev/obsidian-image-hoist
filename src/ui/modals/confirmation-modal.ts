import { App, Modal, Setting } from "obsidian";
import { t } from "../../i18n";

/**
 * A premium confirmation modal for destructive or batch actions.
 */
export class ConfirmationModal extends Modal {
	private onSubmit: () => void | Promise<void>;
	private message: string;
	private isWarning: boolean;

	constructor(app: App, message: string, onSubmit: () => void | Promise<void>, isWarning = false) {
		super(app);
		this.message = message;
		this.onSubmit = onSubmit;
		this.isWarning = isWarning;
	}

	onOpen() {
		const { contentEl } = this;
		
		// Modal Container Styling
		contentEl.addClass("image-hoist-modal");
		
		// Header with Icon
		const headerEl = contentEl.createDiv({ cls: "image-hoist-modal-header" });
		const iconEl = headerEl.createDiv({ cls: "image-hoist-modal-icon" });
		
		// Use Obsidian's built-in icons or a simple SVG
		iconEl.innerHTML = this.isWarning 
			? `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-alert-triangle"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>`
			: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-info"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>`;
		
		headerEl.createEl("h2", { text: t("MODAL_CONFIRM_TITLE"), cls: "image-hoist-modal-title" });

		// Message Body
		contentEl.createEl("p", { text: this.message, cls: "image-hoist-modal-message" });

		// Action Buttons
		const footerEl = contentEl.createDiv({ cls: "image-hoist-modal-footer" });
		
		new Setting(footerEl)
			.addButton((btn) => {
				btn.setButtonText(t("MODAL_CONFIRM_BUTTON"));
				if (this.isWarning) {
					btn.setWarning();
				} else {
					btn.setCta();
				}
				btn.onClick(async () => {
					this.close();
					await this.onSubmit();
				});
			})
			.addButton((btn) => 
				btn
					.setButtonText(t("MODAL_CANCEL_BUTTON"))
					.onClick(() => this.close())
			);
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}
