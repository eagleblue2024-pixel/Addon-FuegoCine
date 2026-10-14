# 🔥 FuegoCine Addon para Nuvio & Stremio

Addon completo y optimizado para **Nuvio** y **Stremio** que extrae películas, series y anime en **Español Latino y Castellano** en calidad Full HD (1080p) directamente desde **[FuegoCine.com](http://www.fuegocine.com/)** sin publicidad invasiva.

---

## 🚀 Características

- 🎬 **Catálogo Completo**: Más de 5,300 películas, estrenos y series organizadas por géneros (Acción, Terror, Comedia, Ciencia Ficción, etc.).
- 🔍 **Búsqueda Instantánea**: Encuentra cualquier título en FuegoCine por nombre en español u original.
- 📺 **Soporte de Series & Temporadas**: Extracción automática de temporadas y episodios con títulos y miniaturas.
- 🎧 **Múltiples Idiomas**: Detección de audio en Español Latino, Castellano y Subtitulado.
- ⚡ **Servidores Rápidos**: Desempaquetado y decodificación automática de servidores como VST, Videro, Unlimplay, Playmate, AVCaption y más.
- 🔗 **Compatibilidad Cinemeta/IMDb**: Funciona tanto desde el catálogo propio como buscando películas en el explorador global de Nuvio y Stremio (IDs `tt...` y `tmdb:...`).
- ☁️ **Listo para Render y GitHub**: Incluye `render.yaml`, `Dockerfile` y configuración lista para subir en 1 minuto.

---

## 🛠️ Guía de Despliegue en Render (Gratis)

Puedes alojar este addon de forma totalmente **gratuita** en Render.com:

### Paso 1: Subir a GitHub
1. Descomprime este archivo ZIP en tu computadora.
2. Abre la terminal en la carpeta descomprimida y ejecuta:
```bash
git init
git add .
git commit -m "Initial commit - FuegoCine Nuvio Addon"
```
3. Crea un nuevo repositorio en [GitHub](https://github.com/new) (puede ser Público o Privado).
4. Vincula y sube los cambios:
```bash
git remote add origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git
git branch -M main
git push -u origin main
```

### Paso 2: Crear el Web Service en Render
1. Ve a [Render.com](https://render.com/) e inicia sesión (con tu cuenta de GitHub).
2. Haz clic en el botón **New +** y selecciona **Web Service**.
3. Selecciona tu repositorio de GitHub recién creado.
4. Render leerá automáticamente el archivo `render.yaml` incluido. Si lo configuras manualmente:
   - **Name**: `fuegocine-addon`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`
5. Haz clic en **Create Web Service**.
6. En 1-2 minutos tu servicio estará activo con una URL como:
   `https://fuegocine-addon.onrender.com`

---

## 📱 Cómo Instalar en Nuvio y Stremio

Una vez que tengas tu URL de Render (o tu servidor local):

### Para Nuvio:
1. Abre la aplicación **Nuvio**.
2. Ve al apartado de **Addons** (o Complementos).
3. Selecciona **Agregar Addon por URL**.
4. Pega la URL de tu manifest:
   `https://tu-servicio.onrender.com/manifest.json`
5. ¡Listo! Ya verás los catálogos de FuegoCine en la pantalla principal.

### Para Stremio:
- **Opción A (Un clic)**: Abre en tu navegador el enlace con el protocolo de Stremio:
  `stremio://tu-servicio.onrender.com/manifest.json`
- **Opción B (Manual)**: En Stremio, ve a la sección de **Addons**, en la barra de búsqueda pega la URL completa `https://tu-servicio.onrender.com/manifest.json` y presiona **Instalar**.

---

## 💻 Ejecución Local (Desarrollo)

Para probar el addon en tu máquina local:

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar el servidor
npm start

# O en modo desarrollo con recarga automática:
npm run dev
```

El servidor arrancará en: `http://localhost:7000`
El manifest estará en: `http://localhost:7000/manifest.json`

---

## 📡 Endpoints del Addon

| Endpoint | Descripción |
| :--- | :--- |
| `GET /manifest.json` | Manifiesto de especificación Stremio & Nuvio v3 |
| `GET /catalog/:type/:id.json` | Catálogo de películas o series |
| `GET /meta/:type/:id.json` | Metadatos y lista de episodios para series |
| `GET /stream/:type/:id.json` | Enlaces a los servidores de video |
| `GET /health` | Verificación de estado de salud del servidor |

---

## ⚖️ Aviso Legal
Este software es exclusivamente un indexador de contenido público de la web fuegocine.com. No aloja ningún archivo de video en sus servidores.
