export default {
	// Commands
	COMMAND_HOIST_ALL: "Subir todas las imágenes de la nota",
	
	// Context Menu
	CONTEXT_MENU_HOIST_SINGLE: "Subir esta imagen",
	CONTEXT_MENU_HOIST_ALL: "Subir todas las imágenes de esta nota",
	
	// Modals
	MODAL_CONFIRM_TITLE: "Confirmar subida de imágenes",
	MODAL_CONFIRM_SINGLE: "¿Estás seguro de que quieres subir \"{{name}}\"? El archivo local se moverá a la papelera.",
	MODAL_CONFIRM_ALL: "Se han encontrado {{count}} imágenes locales. ¿Quieres subirlas a ImgBB y reemplazar los enlaces?{{trash}}",
	MODAL_TRASH_WARNING: " (Los archivos locales se moverán a la papelera)",
	MODAL_CONFIRM_BUTTON: "Confirmar",
	MODAL_CANCEL_BUTTON: "Cancelar",

	// Notices
	NOTICE_STARTING_ALL: "Iniciando subida de {{count}} imágenes...",
	NOTICE_SUCCESS_ALL: "¡Se han subido {{count}} imágenes con éxito!",
	NOTICE_SUCCESS_ALL_CACHE: "¡Se han procesado {{count}} imágenes ({{cacheCount}} desde la caché)!",
	NOTICE_ERROR_ALL: "Error durante el proceso de subida. Revisa la consola.",
	NOTICE_STARTING_SINGLE: "Subiendo imagen: {{name}}...",
	NOTICE_SUCCESS_SINGLE: "¡{{name}} subida con éxito!",
	NOTICE_SUCCESS_CACHE: "¡{{name}} recuperada de la caché con éxito!",
	NOTICE_ERROR_SINGLE: "Error al subir {{name}}. Revisa la consola.",
	NOTICE_NO_IMAGES: "No se han encontrado imágenes locales en esta nota.",
	NOTICE_NO_MARKDOWN: "No se ha encontrado ninguna nota activa.",
};
