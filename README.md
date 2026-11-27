# API y web de películas (Node.js + Express + MongoDB)

Aplicación para gestionar una colección de películas con las operaciones CRUD
(crear, consultar, modificar y eliminar). Los datos se guardan en MongoDB y el
proyecto está organizado según el patrón MVC. Incluye una API JSON y una
interfaz web hecha con Nunjucks.

## Requisitos

- Node.js (versión LTS)
- MongoDB en marcha en el equipo (por defecto en `127.0.0.1:27017`)

## Instalación

1. Abre una terminal en la carpeta del proyecto.
2. Instala las dependencias:

```bash
npm install
```

## Configuración

Crea en la raíz del proyecto un archivo `.env` con este contenido
(cambia el nombre de la base de datos si quieres):

```
MONGODB_URI=mongodb://127.0.0.1:27017/movies
PORT=3000
```

El archivo `.env` no se incluye en el repositorio ni en la entrega.

## Ejecución

```bash
npm start
```

El servidor queda en `http://localhost:3000`.

## Uso

### API JSON

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/movies` | Lista todas las películas (admite `?genre=Drama`) |
| GET | `/movies/:id` | Consulta una película por su `id` |
| POST | `/movies` | Crea una película |
| PATCH | `/movies/:id` | Modifica los campos enviados |
| DELETE | `/movies/:id` | Elimina una película |

Respuestas: `200` / `201` si todo va bien, `400` si el id o los datos no son
válidos, `404` si la película no existe y `500` si falla el acceso a datos.

### Interfaz web

| Ruta | Descripción |
|---|---|
| `/web/movies` | Listado de películas |
| `/web/movies/:id` | Detalle de una película |
| `/web/movies/new` | Formulario para añadir |
| `/web/movies/:id/edit` | Formulario para editar |

## Estructura del proyecto

| Carpeta / archivo | Función |
|---|---|
| `models/` | Modelo de datos y esquema de Mongoose (`Movie`) con sus validaciones |
| `controllers/` | Lógica de las operaciones: `movies.js` (API) y `movies-views.js` (web) |
| `routes/` | Asocia cada ruta HTTP con su función del controlador |
| `views/` | Plantillas Nunjucks (`layout`, listado, detalle y formulario) |
| `config/` | Conexión a MongoDB (`database.js`) |
| `app.js` | Configuración general, conexión a la base de datos y registro de rutas |


# Cambios: películas favoritas

Se ha añadido la opción de marcar una película como favorita desde la página web (`/web/movies`).

- 1 clic en la estrella: la película queda como favorita (★).
- Otro clic: deja de ser favorita (☆).
- El estado se guarda en MongoDB, así que se mantiene al recargar la página.

## Carpetas y archivos modificados

| Carpeta | Archivo | Cambio |
|---------|---------|--------|
| `models/` | `movie.js` | Nuevo campo `favorite` (Boolean, por defecto `false`). |
| `controllers/` | `movies-views.js` | Nueva función `toggleFavorite`: cambia el valor de `favorite` y redirige a `/web/movies`. |
| `routes/` | `movies-views.js` | Nueva ruta `POST /web/movies/:id/favorite` que llama a `toggleFavorite`. |
| `views/` | `list.njk` | Nueva columna "Favorita" con un botón ☆/★ por película. |

## Carpetas que no se han tocado

`config/`, `app.js`, `routes/movies-api.js`, `controllers/movies.js`, `views/layout.njk`, `views/detail.njk` y `views/form.njk`.

## Cómo probarlo

1. Arrancar el servidor: `node app.js`
2. Abrir `http://localhost:3000/web/movies`
3. Hacer clic en la estrella de una película y recargar con F5.
4. Hacer clic otra vez para quitarla de favoritas.
