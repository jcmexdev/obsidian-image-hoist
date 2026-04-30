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
	MODAL_TRASH_WARNING: " (Local files will be moved to trash)",
	MODAL_CONFIRM_BUTTON: "Confirm",
	MODAL_CANCEL_BUTTON: "Cancel",

	// Notices
	NOTICE_STARTING_ALL: "Starting hoist of {{count}} images...",
	NOTICE_SUCCESS_ALL: "Successfully hoisted {{count}} images!",
	NOTICE_SUCCESS_ALL_CACHE: "Successfully processed {{count}} images ({{cacheCount}} from cache)!",
	NOTICE_ERROR_ALL: "Error during hoist process. Check console.",
	NOTICE_STARTING_SINGLE: "Hoisting image: {{name}}...",
	NOTICE_SUCCESS_SINGLE: "Successfully hoisted {{name}}!",
	NOTICE_SUCCESS_CACHE: "Successfully retrieved {{name}} from cache!",
	NOTICE_ERROR_SINGLE: "Failed to hoist {{name}}. Check console.",
	NOTICE_NO_IMAGES: "No local images found in this note.",
	NOTICE_NO_MARKDOWN: "No active markdown note found.",
};
