import { App, Modal, Setting } from "obsidian";

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
        contentEl.createEl("h2", { text: "Confirm image hoist" });
        contentEl.createEl("p", { text: this.message });

        new Setting(contentEl)
            .addButton((btn) =>
                btn
                    .setButtonText("Confirm")
                    .setCta()
                    .onClick(async () => {
                        this.close();
                        await this.onSubmit();
                    })
            )
            .addButton((btn) =>
                btn.setButtonText("Cancel").onClick(() => this.close())
            );
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}
