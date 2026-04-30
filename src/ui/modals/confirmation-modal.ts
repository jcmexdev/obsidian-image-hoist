import { App, Modal, Setting } from "obsidian";
import { t } from "../../i18n";

/**
 * A reusable confirmation modal for destructive or batch actions.
 */
export class ConfirmationModal extends Modal {
	private onSubmit: () => void | Promise<void>;
	private message: string;

	constructor(app: App, message: string, onSubmit: () => void | Promise<void>) {
		super(app);
		this.message = message;
		this.onSubmit = onSubmit;
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.createEl("h2", { text: t("MODAL_CONFIRM_TITLE") });
		contentEl.createEl("p", { text: this.message });

		new Setting(contentEl)
			.addButton((btn) =>
				btn
					.setButtonText(t("MODAL_CONFIRM_BUTTON"))
					.setCta()
					.onClick(async () => {
						this.close();
						await this.onSubmit();
					})
			)
			.addButton((btn) =>
				btn.setButtonText(t("MODAL_CANCEL_BUTTON")).onClick(() => this.close())
			);
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}
