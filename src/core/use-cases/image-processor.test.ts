import { VaultService } from 'core/ports/vault';
import { describe, expect, it, vi } from 'vitest';
import { ImageUploader } from '../ports/uploader';
import { ImageProcessor } from './image-processor';

describe('ImageProcessor', () => {
    const mockCache: Record<string, string> = {};
    const onCacheUpdate = vi.fn().mockResolvedValue(undefined);

    it('should format a remote link correctly preserving original link text', async () => {
        // Arrange
        const uploadMock = vi.fn().mockResolvedValue('https://imgbb.com/image123.png');
        const mockVault: VaultService = {
            readBinary: vi.fn().mockResolvedValue(new ArrayBuffer(10)),
            deleteFile: vi.fn().mockResolvedValue(undefined),
            getImagesInFile: vi.fn().mockResolvedValue([]),
            readFile: vi.fn().mockResolvedValue(''),
            writeFile: vi.fn().mockResolvedValue(undefined),
        };
        const mockUploader: ImageUploader = {
            upload: uploadMock
        };
        const processor = new ImageProcessor(mockUploader, mockVault, mockCache, onCacheUpdate);
        const dummyData = new ArrayBuffer(0);

        // Act
        const result = await processor.processImage(dummyData, 'test.png', 'imagen.png|100');

        // Assert
        expect(result.link).toBe('![imagen.png|100](https://imgbb.com/image123.png)');
        expect(result.isCacheHit).toBe(false);
        expect(uploadMock).toHaveBeenCalledWith(dummyData, 'test.png');
        expect(onCacheUpdate).toHaveBeenCalled();
    });

    it('should use cache if hash already exists', async () => {
        // Arrange
        const uploadMock = vi.fn();
        const existingHash = "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"; // Empty hash
        const existingUrl = "https://imgbb.com/cached.png";
        const cache = { [existingHash]: existingUrl };
        
        const mockVault: VaultService = {
            readBinary: vi.fn(),
            deleteFile: vi.fn(),
            getImagesInFile: vi.fn(),
            readFile: vi.fn(),
            writeFile: vi.fn(),
        };
        const mockUploader: ImageUploader = { upload: uploadMock };
        
        const processor = new ImageProcessor(mockUploader, mockVault, cache, onCacheUpdate);
        
        // Act
        const result = await processor.processImage(new ArrayBuffer(0), 'test.png', 'alt');
        
        // Assert
        expect(result.link).toBe('![alt](https://imgbb.com/cached.png)');
        expect(result.isCacheHit).toBe(true);
        expect(uploadMock).not.toHaveBeenCalled();
    });
});
