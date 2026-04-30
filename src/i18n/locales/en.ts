export default {
	// Commands
	COMMAND_HOIST_ALL: "Hoist all images in current note",
	
	// Context Menu
	CONTEXT_MENU_HOIST_SINGLE: "Hoist this image",
	CONTEXT_MENU_HOIST_ALL: "Hoist all images in this note",
	
	// Modals
	MODAL_CONFIRM_TITLE: "Confirm image hoist",
	MODAL_CONFIRM_SINGLE: "Are you sure you want to hoist \"{{name}}\"? The local file will be moved to trash.",
	MODAL_CONFIRM_ALL: "Found {{count}} local images. Do you want to hoist them to ImgBB and replace the links?{{trash}}",
	MODAL_TRASH_WARNING: "(Local files will be moved to trash)",
	MODAL_CONFIRM_BUTTON: "Confirm",
	MODAL_CANCEL_BUTTON: "Cancel",

	// Notices
	NOTICE_STARTING_ALL: "Starting hoist of {{count}} images...",
	NOTICE_SUCCESS_ALL: "Successfully hoisted {{count}} images!",
	NOTICE_SUCCESS_ALL_CACHE: "Successfully processed {{count}} images ({{cacheCount}} from cache)!",
	NOTICE_ERROR_ALL: "Error during hoist process. Please try again.",
	NOTICE_STARTING_SINGLE: "Hoisting image: {{name}}...",
	NOTICE_SUCCESS_SINGLE: "Successfully hoisted {{name}}!",
	NOTICE_SUCCESS_CACHE: "Successfully retrieved {{name}} from cache!",
	NOTICE_ERROR_SINGLE: "Failed to hoist {{name}}.",
	NOTICE_NO_IMAGES: "No local images found in this note.",
	NOTICE_NO_MARKDOWN: "No active Markdown note found.",
	NOTICE_CACHE_CLEARED: "Upload cache cleared successfully!",

	// Settings
	SETTINGS_TITLE: "Image hoist settings",
	SETTINGS_API_KEY_NAME: "ImgBB API key",
	SETTINGS_API_KEY_DESC: "Select the secret that contains your ImgBB API key from Obsidian's SecretStorage.",
	SETTINGS_AUTO_HOIST_NAME: "Auto-hoist on paste or drag",
	SETTINGS_AUTO_HOIST_DESC: "Automatically upload images to ImgBB when pasting or dragging them into the editor.",
	SETTINGS_BULK_LIMIT_NAME: "Bulk upload limit",
	SETTINGS_BULK_LIMIT_DESC: "Maximum images to hoist per note (1-20)",
	SETTINGS_DELETE_NAME: "Delete local image after upload",
	SETTINGS_DELETE_DESC: "Move local file to trash after successful hoist.",
	SETTINGS_MAINTENANCE: "Maintenance",
	SETTINGS_CLEAR_CACHE_NAME: "Clear upload cache",
	SETTINGS_CLEAR_CACHE_DESC: "Reset the local cache of uploaded images.",
	SETTINGS_CLEAR_CACHE_BUTTON: "Clear cache",
	SETTINGS_CLEAR_CACHE_CONFIRM: "Are you sure you want to clear the upload cache?",
};
