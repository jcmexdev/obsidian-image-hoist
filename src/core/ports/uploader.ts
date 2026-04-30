export interface ImageUploader {
    upload(fileData: ArrayBuffer, fileName: string): Promise<string>;
}
