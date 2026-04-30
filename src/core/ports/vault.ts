export interface VaultService {
    readBinary(path: string): Promise<ArrayBuffer>;
    deleteFile(path: string): Promise<void>;
}