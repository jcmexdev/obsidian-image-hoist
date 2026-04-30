import { App, Modal, Setting, setIcon } from "obsidian";
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
		
		contentEl.addClass("image-hoist-modal");
		
		// Header with Icon
		const headerEl = contentEl.createDiv({ cls: "image-hoist-modal-header" });
		const iconEl = headerEl.createDiv({ cls: "image-hoist-modal-icon" });
		
		// Using Obsidian's native setIcon for security and consistency
		if (this.isWarning) {
			setIcon(iconEl, "alert-triangle");
		} else {
			setIcon(iconEl, "info");
		}
		
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
