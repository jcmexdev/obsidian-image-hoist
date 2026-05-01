export default {
	// Commands
	COMMAND_HOIST_ALL: "Subir todas las imágenes de la nota",
	
	// Context Menu
	CONTEXT_MENU_HOIST_SINGLE: "Subir esta imagen (hoist)",
	CONTEXT_MENU_HOIST_ALL: "Subir todas las imágenes de esta nota (hoist)",
	
	// Modals
	MODAL_CONFIRM_TITLE: "Confirmar subida de imágenes",
	MODAL_CONFIRM_SINGLE: "¿Estás seguro de que quieres subir \"{{name}}\"? El archivo local se moverá a la papelera.",
	MODAL_CONFIRM_ALL: "Se han encontrado {{count}} imágenes locales. ¿Quieres subirlas a ImgBB y reemplazar los enlaces?{{trash}}",
	MODAL_TRASH_WARNING: "Los archivos locales se moverán a la papelera",
	MODAL_CONFIRM_BUTTON: "Confirmar",
	MODAL_CANCEL_BUTTON: "Cancelar",

	// Notices
	NOTICE_STARTING_ALL: "Iniciando subida de {{count}} imágenes...",
	NOTICE_SUCCESS_ALL: "¡Se han subido {{count}} imágenes con éxito!",
	NOTICE_SUCCESS_ALL_CACHE: " se han procesado {{count}} imágenes ({{cacheCount}} desde la caché)!",
	NOTICE_ERROR_ALL: "Error durante el proceso de subida.",
	NOTICE_STARTING_SINGLE: "Subiendo imagen: {{name}}...",
	NOTICE_SUCCESS_SINGLE: "¡{{name}} subida con éxito!",
	NOTICE_SUCCESS_CACHE: "¡{{name}} recuperada de la caché con éxito!",
	NOTICE_ERROR_SINGLE: "Error al subir {{name}}.",
	NOTICE_NO_IMAGES: "No se han encontrado imágenes locales en esta nota.",
	NOTICE_NO_MARKDOWN: "No se ha encontrado ninguna nota activa.",
	NOTICE_CACHE_CLEARED: "¡La caché de subidas se ha limpiado con éxito!",

	// Settings
	SETTINGS_TITLE: "Ajustes de Image Hoist",
	SETTINGS_API_KEY_NAME: "Clave API de ImgBB",
	SETTINGS_API_KEY_DESC: "Selecciona el secreto que contiene tu clave API de ImgBB del SecretStorage de Obsidian.",
	SETTINGS_AUTO_HOIST_NAME: "Subida automática al pegar o arrastrar",
	SETTINGS_AUTO_HOIST_DESC: "Sube imágenes a ImgBB automáticamente al pegarlas o arrastrarlas al editor.",
	SETTINGS_BULK_LIMIT_NAME: "Límite de subida por lote",
	SETTINGS_BULK_LIMIT_DESC: "Máximo de imágenes a subir por nota (1-20)",
	SETTINGS_DELETE_NAME: "Borrar imagen local tras subir",
	SETTINGS_DELETE_DESC: "Mueve el archivo local a la papelera tras una subida exitosa.",
	SETTINGS_MAINTENANCE: "Mantenimiento",
	SETTINGS_CLEAR_CACHE_NAME: "Limpiar caché de subidas",
	SETTINGS_CLEAR_CACHE_DESC: "Reinicia el historial local de imágenes subidas.",
	SETTINGS_CLEAR_CACHE_BUTTON: "Limpiar caché",
	SETTINGS_CLEAR_CACHE_CONFIRM: "¿Estás seguro de que quieres limpiar la caché de subidas?",
};
