import { VaultService } from 'core/ports/vault';
import { describe, expect, it, vi } from 'vitest';
import { ImageUploader } from '../ports/uploader';
import { ImageProcessor } from './image-processor';

describe('ImageProcessor', () => {
    it('should format a remote link correctly after upload', async () => {
        // Arrange
        const uploadMock = vi.fn().mockResolvedValue('https://imgbb.com/image123.png');
        const mockVault: VaultService = {
            readBinary: vi.fn().mockResolvedValue(new ArrayBuffer(10)),
            deleteFile: vi.fn().mockResolvedValue(undefined),
        };
        const mockUploader: ImageUploader = {
            upload: uploadMock
        };
        const processor = new ImageProcessor(mockUploader, mockVault);
        const dummyData = new ArrayBuffer(0);

        // Act
        const result = await processor.processImage(dummyData, 'test.png');

        // Assert
        expect(result).toBe('![](https://imgbb.com/image123.png)');
        expect(uploadMock).toHaveBeenCalledWith(dummyData, 'test.png');
    });

    it('should read file and upload', async () => {
        // Arrange
        const uploadMock = vi.fn().mockResolvedValue('https://imgbb.com/image123.png');
        const mockVault: VaultService = {
            readBinary: vi.fn().mockResolvedValue(new ArrayBuffer(10)),
            deleteFile: vi.fn().mockResolvedValue(undefined),
        };
        const mockUploader: ImageUploader = {
            upload: uploadMock
        };

        const processor = new ImageProcessor(mockUploader, mockVault);
        const result = await processor.processImage(new ArrayBuffer(0), 'test.png');

        // Assert
        expect(result).toBe('![](https://imgbb.com/image123.png)');
        expect(uploadMock).toHaveBeenCalledWith(new ArrayBuffer(0), 'test.png');
    });
});
