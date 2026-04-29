# Image Hoist for Obsidian

Image Hoist is an Obsidian plugin designed to optimize your vault's storage and portability by automatically offloading local images to [ImgBB](https://imgbb.com/).

## Core Objective

The primary goal of this plugin is to detect local images in your vault, upload them to ImgBB, and replace the local file references with remote markdown links. This keeps your vault lightweight and makes your notes easier to share and sync.

## Features

- **Automatic Upload:** Automatically detects and uploads local images.
- **Link Replacement:** Replaces `![[image.png]]` or `![](image.png)` with remote ImgBB links.
- **Storage Optimization:** Reduces the size of your vault by removing binary image files after successful upload.
- **Portability:** Access your images from any device without needing to sync large binary files.

## Installation

### From Obsidian (Not yet available)
1. Go to **Settings** > **Community plugins** > **Browse**.
2. Search for "Image Hoist".
3. Click **Install**, then **Enable**.

### Manual Installation
1. Download the latest release (`main.js`, `manifest.json`, `styles.css`).
2. Create a folder named `obsidian-image-hoist` in your vault's `.obsidian/plugins/` directory.
3. Move the downloaded files into that folder.
4. Reload Obsidian and enable the plugin in **Settings** > **Community plugins**.

## Configuration

You will need an **ImgBB API Key** to use this plugin:
1. Create a free account at [ImgBB](https://imgbb.com/).
2. Get your API key from [ImgBB API settings](https://api.imgbb.com/).
3. Paste the key into the plugin settings in Obsidian.

## License

This project is licensed under the MIT License.
