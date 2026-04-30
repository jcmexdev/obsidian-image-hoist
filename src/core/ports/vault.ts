export interface VaultService {
    readBinary(path: string): Promise<ArrayBuffer>;
    deleteFile(path: string): Promise<void>;
    getImagesInFile(path: string): Promise<{path: string, name: string, start: number, end: number, originalLink: string}[]>;
    readFile(path: string): Promise<string>;
    writeFile(path: string, content: string): Promise<void>;
}