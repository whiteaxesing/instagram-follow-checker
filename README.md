# Insta Follow Checker

[English](#english) | [Español](#español)

<img width="1610" height="879" alt="Captura de pantalla 2026-05-21 a la(s) 1 58 37 p  m" src="https://github.com/user-attachments/assets/c416f339-c180-4179-bdfb-be5555692c71" />

<img width="1615" height="870" alt="Captura de pantalla 2026-05-21 a la(s) 1 58 22 p  m" src="https://github.com/user-attachments/assets/9b9d61c3-24a9-4f08-b267-4cf94b05883f" />

---

## English

A browser extension for Chrome and Firefox that shows you who doesn't follow you back on Instagram — and lets you unfollow them directly.

### Features

- Scans everyone you follow and detects who doesn't follow you back
- Shows profile picture, username, and full name
- **Unfollow** button next to each user
- Export the full list as a JSON file
- Built-in rate limiting to avoid temporary Instagram blocks

### Installation

#### Chrome

**Option A — Install from Chrome Web Store**

[Install on Chrome](https://chromewebstore.google.com/detail/insta-follow-checker/mngifcbnjpakdgckcncdhcgicoehhjfp)

**Option B — Manual install (Developer Mode)**

1. Download the latest `insta-follow-checker-chrome.zip` from the [Releases](https://github.com/whiteaxesing/instagram-follow-checker/releases) page and unzip it
2. Open Chrome and go to `chrome://extensions/`
3. Enable **Developer mode** (toggle in the top-right corner)
4. Click **Load unpacked** and select the unzipped folder

#### Firefox

**Option A — Install from Firefox Add-ons** *(coming soon)*

**Option B — Manual install**

1. Download the latest `insta-follow-checker-firefox.zip` from the [Releases](https://github.com/whiteaxesing/instagram-follow-checker/releases) page
2. Open Firefox and go to `about:debugging#/runtime/this-firefox`
3. Click **Load Temporary Add-on...**
4. Select the `.zip` file directly

> **Note:** Temporary add-ons are removed when Firefox closes. For a permanent install without the Add-ons store, you need [Firefox Developer Edition](https://www.mozilla.org/en-US/firefox/developer/) or Firefox Nightly with `xpinstall.signatures.required` set to `false` in `about:config`.

### How to use

1. Go to [instagram.com](https://www.instagram.com) and make sure you're logged in
2. Click the extension icon in your browser toolbar
3. Press **Analyze** — a progress bar will show as it scans your following list
4. Users who don't follow you back appear with their profile picture
5. Click **Unfollow** next to any user to unfollow them directly
6. Click **Export** to download the full list as a JSON file

### Privacy

This extension runs entirely in your browser. No data is sent to any external server. It uses Instagram's own internal API (the same one the website uses) with your existing session cookies.

### For developers — building from source

```bash
git clone https://github.com/whiteaxesing/instagram-follow-checker.git
cd instagram-follow-checker
./build.sh
# Output: dist/insta-follow-checker-chrome.zip
#         dist/insta-follow-checker-firefox.zip
```

### Disclaimer

This project is not affiliated with or endorsed by Instagram or Meta. Use responsibly and in accordance with [Instagram's Terms of Use](https://help.instagram.com/581066165581870). The extension relies on Instagram's private API, which may change without notice.

---

## Español

Una extensión para Chrome y Firefox que te muestra quién no te sigue de vuelta en Instagram — y te permite hacer unfollow directamente.

### Características

- Escanea a todos los que sigues y detecta quién no te sigue de vuelta
- Muestra foto de perfil, nombre de usuario y nombre completo
- Botón de **Unfollow** junto a cada usuario
- Exporta la lista completa como archivo JSON
- Pausas automáticas para evitar bloqueos temporales de Instagram

### Instalación

#### Chrome

**Opción A — Instalar desde Chrome Web Store**

[Instalar en Chrome](https://chromewebstore.google.com/detail/insta-follow-checker/mngifcbnjpakdgckcncdhcgicoehhjfp)

**Opción B — Instalación manual (Modo desarrollador)**

1. Descarga el archivo `insta-follow-checker-chrome.zip` desde la página de [Releases](https://github.com/whiteaxesing/instagram-follow-checker/releases) y descomprímelo
2. Abre Chrome y ve a `chrome://extensions/`
3. Activa el **Modo desarrollador** (toggle en la esquina superior derecha)
4. Haz clic en **Cargar extensión sin empaquetar** y selecciona la carpeta descomprimida

#### Firefox

**Opción A — Instalar desde Firefox Add-ons** *(próximamente)*

**Opción B — Instalación manual**

1. Descarga el archivo `insta-follow-checker-firefox.zip` desde la página de [Releases](https://github.com/whiteaxesing/instagram-follow-checker/releases)
2. Abre Firefox y ve a `about:debugging#/runtime/this-firefox`
3. Haz clic en **Cargar complemento temporal...**
4. Selecciona el archivo `.zip` directamente

> **Nota:** Los complementos temporales se eliminan al cerrar Firefox. Para una instalación permanente sin la tienda de complementos, necesitas [Firefox Developer Edition](https://www.mozilla.org/es-ES/firefox/developer/) o Firefox Nightly con `xpinstall.signatures.required` en `false` desde `about:config`.

### Cómo usar

1. Ve a [instagram.com](https://www.instagram.com) y asegúrate de estar logueado
2. Haz clic en el ícono de la extensión en la barra del navegador
3. Presiona **Analizar** — una barra de progreso mostrará el avance del escaneo
4. Los usuarios que no te siguen de vuelta aparecen con su foto de perfil
5. Haz clic en **Unfollow** junto a cualquier usuario para dejar de seguirlo
6. Haz clic en **Exportar** para descargar la lista completa como JSON

### Privacidad

Esta extensión funciona completamente en tu navegador. No se envían datos a ningún servidor externo. Usa la API interna de Instagram (la misma que usa el sitio web) con tus cookies de sesión existentes.

### Para desarrolladores — compilar desde el código fuente

```bash
git clone https://github.com/whiteaxesing/instagram-follow-checker.git
cd instagram-follow-checker
./build.sh
# Resultado: dist/insta-follow-checker-chrome.zip
#            dist/insta-follow-checker-firefox.zip
```

### Aviso legal

Este proyecto no tiene afiliación ni está respaldado por Instagram o Meta. Úsalo de forma responsable y de acuerdo con los [Términos de uso de Instagram](https://help.instagram.com/581066165581870). La extensión depende de la API privada de Instagram, que puede cambiar sin previo aviso.
