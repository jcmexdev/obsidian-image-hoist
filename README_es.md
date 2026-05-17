# Image Hoist para Obsidian

[Read in English 🇺🇸](README.md)

![hero.png](https://i.ibb.co/21VF4jVd/hero-png.jpg)

Sube automáticamente tus imágenes locales a la nube ([ImgBB](https://imgbb.com/)) para mantener tu vault ligero y facilitar la sincronización. ¡Se acabaron los enlaces rotos al copiar tus notas a un blog o correo!

## 🚀 Características

- **Ahorra espacio**: Deja de almacenar imágenes pesadas en tu dispositivo local.
- **Subida Automática**: Pega una imagen y se sube sola en segundo plano.
- **Evita Duplicados**: Reconoce si ya subiste una foto y reutiliza el enlace.
- **Limpieza Rápida**: Convierte todas las fotos locales de una nota vieja con un solo clic.

## 🛠️ Inicio Rápido

1. Instala el plugin en Obsidian.
2. Consigue una clave gratuita en [ImgBB](https://api.imgbb.com/) y pégala en los ajustes.

## 📖 Cómo usarlo

> ⚠️ **IMPORTANTE**: Este plugin actualmente **SOLO funciona cuando tu editor está en Modo Fuente (Source Mode)**.

### 1. Subir una imagen local del Vault
La forma más cómoda es hacer **clic derecho sobre la imagen** y seleccionar **Subir esta imagen (hoist)**. También puedes poner el cursor sobre ella y ejecutar el comando desde la Paleta de Comandos.

![Subir una sola imagen](assets/hoist-one-image.webp)

### 2. Subida Masiva de imágenes locales del Vault (El botón mágico)
**Haz clic derecho en cualquier parte de tu nota** y selecciona **Subir todas las imágenes de esta nota (hoist)** para una acción masiva ultrarrápida. También puedes usar la Paleta de Comandos (`Cmd/Ctrl + P`) y ejecutar **Subir todas las imágenes de la nota**.

![Subida Masiva](assets/hoist-bulk-images.webp)

### 3. Subida Automática al Pegar
Simplemente arrastra y suelta o pega una foto en tu nota; irá directa a la nube (si lo activas en los ajustes).

![Subida Automática al Pegar](assets/auto-hoist-on-paste.webp)

### 4. Eliminar Archivos Locales
Cuando subes una imagen, el archivo local se elimina automáticamente de tu vault para ahorrar espacio (si lo activas en los ajustes).

![Eliminar Archivos Locales](assets/delete-on-hoist.webp)

## 💻 Desarrollo

Si deseas contribuir o compilar el plugin desde el código fuente:

1. Clona este repositorio en la carpeta de plugins de tu vault de Obsidian: `<vault>/.obsidian/plugins/obsidian-image-hoist`
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Inicia la compilación de desarrollo en modo activo (watch):
   ```bash
   npm run dev
   ```
4. Para compilar una versión de producción:
   ```bash
   npm run build
   ```

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Siéntete libre de abrir un issue o enviar un pull request para sugerir mejoras, reportar errores o añadir nuevas funcionalidades.

## 📄 Licencia

Este proyecto está bajo la [Licencia MIT](LICENSE).
