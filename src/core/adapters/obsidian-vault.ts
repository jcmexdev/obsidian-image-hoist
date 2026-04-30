import { VaultService } from "core/ports/vault";
import { App, TFile } from "obsidian";

export class ObsidianVaultAdapter implements VaultService {
    constructor(private app: App) {}

    async readBinary(path: string): Promise<ArrayBuffer> {
        const file = this.app.vault.getAbstractFileByPath(path);
        if (file instanceof TFile) {
            return await this.app.vault.readBinary(file);
        }
        throw new Error("File not found");
    }

    async deleteFile(path: string): Promise<void> {
        const file = this.app.vault.getAbstractFileByPath(path);
        if (file instanceof TFile) {
            await this.app.fileManager.trashFile(file);
        }
    }
}