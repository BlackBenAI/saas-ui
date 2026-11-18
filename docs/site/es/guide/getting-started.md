# Primeros pasos

Esta guía te lleva desde un clon nuevo hasta un proyecto local guardado.

## Requisitos

- Node.js 20 o superior
- npm 10 o superior
- Opcional: Docker 24+ y Docker Compose v2
- Un navegador moderno compatible con IndexedDB

## Ejecutar en local

```bash
git clone git@github.com:BlackBenAI/saas-ui.git
cd saas-ui/frontend
npm install
npm run dev
```

Abre `http://localhost:5173`.

El editor está disponible en `http://localhost:5173/dashboard`.

## Ejecutar con Docker

Desde la raíz del repositorio:

```bash
docker compose up --build
```

Abre `http://localhost:3000`. Para usar otro puerto del host:

```bash
FRONTEND_PORT=3010 docker compose up --build
```

## Primera sesión

1. Abre `/dashboard`. Se crea un proyecto local automáticamente si no existe ninguno.
2. Abre `/projects` para crear, duplicar o eliminar proyectos.
3. Haz clic en el nombre del proyecto en la cabecera y cámbialo.
4. Espera a que el pie de página muestre **Guardado localmente**.
5. Recarga la página. El nombre del proyecto y el design system se restauran desde IndexedDB.
6. Usa los botones de la barra lateral y de propiedades para plegar y desplegar paneles.
7. Usa deshacer y rehacer en la cabecera para recorrer el historial local.

Los diez módulos son interactivos: Resumen, Colores, Tipografía, Maquetación, Componentes,
Efectos, Movimiento, Recursos, Reglas de IA y Exportar. Exporta cualquier dirección como CSS,
Tailwind, TypeScript, JSON o Markdown. La exportación también crea starters de Vite + React y
Next.js + shadcn, y un archivo JSON de variables de Figma. Consulta la
[Hoja de ruta (EN)](/guide/roadmap) para lo siguiente.

## Comandos

| Comando | Propósito |
|---|---|
| `make install` | Instalar dependencias del frontend |
| `make dev` | Iniciar el servidor Vite |
| `make build` | Comprobar TypeScript y construir el bundle |
| `make preview` | Previsualizar el build de producción |
| `make test` | Ejecutar la suite Vitest |
| `make lint` | Ejecutar ESLint sin avisos |
| `make typecheck` | Ejecutar `tsc --noEmit` |
| `make up` | Construir e iniciar el contenedor frontend |
| `make down` | Detener el contenedor |
| `make logs` | Seguir los logs del contenedor |

También puedes usar npm directamente desde `frontend/`:

```bash
npm run dev
npm run build
npm run preview
npm run test -- --run
npm run lint
npm run typecheck
```

## Configuración

| Variable | Dónde | Propósito |
|---|---|---|
| `VITE_REPOSITORY_URL` | `frontend/.env.local` | Cambiar el enlace de GitHub en la interfaz |
| `FRONTEND_PORT` | shell o `.env` | Puerto del host para el frontend Docker |

El editor local no necesita URL de API, base de datos ni autenticación.

## Solución de problemas

### El puerto 5173 ya está en uso

```bash
npm run dev -- --port 5174
```

### La página está en blanco o atascada en Loading

- Comprueba Node.js 20+ con `node --version`.
- Elimina `frontend/node_modules` y ejecuta `npm install` de nuevo.
- Revisa la consola del navegador y la terminal de Vite para el primer error.

### El proyecto no persiste

- Comprueba que el navegador no está en modo privado restringido que bloquee IndexedDB.
- Abre DevTools → Application → IndexedDB → `saas-ui`.
- El pie de página debe mostrar **Guardado localmente** tras un breve retardo.

### Necesito restablecer los datos locales

Abre DevTools → Application → Storage → Clear site data, o elimina la base IndexedDB
`saas-ui`. Esto borra los proyectos locales de forma permanente. Consulta
[Datos locales (EN)](/guide/local-first-data).

## Siguiente

- [Arquitectura (EN)](/guide/architecture)
- [Datos locales (EN)](/guide/local-first-data)
- [Contribuir (EN)](/guide/contributing)
