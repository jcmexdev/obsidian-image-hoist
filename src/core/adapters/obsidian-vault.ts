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

    async getImagesInFile(path: string): Promise<{path: string, name: string, start: number, end: number, originalLink: string}[]> {
        const file = this.app.vault.getAbstractFileByPath(path);
        if (!(file instanceof TFile)) return [];

        const cache = this.app.metadataCache.getFileCache(file);
        if (!cache?.embeds) return [];

        const imageExtensions = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'];
        const images: {path: string, name: string, start: number, end: number, originalLink: string}[] = [];

        for (const embed of cache.embeds) {
            const imageFile = this.app.metadataCache.getFirstLinkpathDest(embed.link, file.path);
            
            if (imageFile instanceof TFile && imageExtensions.includes(imageFile.extension.toLowerCase())) {
                // Extract content inside brackets: ![[CONTENT]] or ![CONTENT](link)
                let innerContent = "";
                const original = embed.original;
                
                if (original.startsWith("![[")) {
                    // Wikilink: ![[image.png|100]] -> image.png|100
                    innerContent = original.substring(3, original.length - 2);
                } else if (original.startsWith("![")) {
                    // Markdown: ![alt text](link) -> alt text
                    const closeBracketIndex = original.indexOf("]");
                    if (closeBracketIndex !== -1) {
                        innerContent = original.substring(2, closeBracketIndex);
                    }
                }

                images.push({
                    path: imageFile.path,
                    name: imageFile.name,
                    start: embed.position.start.offset,
                    end: embed.position.end.offset,
                    originalLink: innerContent
                });
            }
        }

        return images;
    }

    async readFile(path: string): Promise<string> {
        const file = this.app.vault.getAbstractFileByPath(path);
        if (file instanceof TFile) {
            return await this.app.vault.read(file);
        }
        throw new Error("File not found");
    }

    async writeFile(path: string, content: string): Promise<void> {
        const file = this.app.vault.getAbstractFileByPath(path);
        if (file instanceof TFile) {
            await this.app.vault.modify(file, content);
            return;
        }
        throw new Error("File not found");
    }
}