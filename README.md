#  Git Esencial: Flujo de Trabajo y Comandos Clave

Guía de los comandos principales de Git para el proyecto, utilizando el repositorio remoto: **`https://github.com/ang0vrg/git-integrator-1/`**.

---

## I. Configuración Inicial

| Comando | Descripción |
| :--- | :--- |
| `git config --global user.name "Angel"` | Establece el **nombre** para todos los commits. |
| `git config --global user.email "angel.vargas.uni@gmail.com"` | Establece el **correo electrónico** asociado a los commits y a GitHub. |

---

## II. Creación y Conexión del Repositorio

| Comando | Función | Ejemplo Específico |
| :--- | :--- | :--- |
| `git init` | **Inicializa** un nuevo repositorio de Git en la carpeta actual. | `git init` |
| `git remote add origin [URL]` | **Vincula** nuestro repositorio local con el remoto. | `git remote add origin https://github.com/ang0vrg/git-integrator-1/` |
| `git remote -v` | **Verifica** la URL `origin`. | `git remote -v` |

---

## III. Flujo de Trabajo Básico (Añadir, Confirmar y Subir)

### 1. Preparar los Cambios

| Comando | Descripción |
| :--- | :--- |
| `git add .` | Añade **TODOS** los archivos nuevos y modificados al área de preparación. |

### 2. Guardar los Cambios (`Commit`) 

| Comando | Descripción |
| :--- | :--- |
| `git commit -m "Tu mensaje"` | Crea una **instantánea** de los archivos preparados con un mensaje descriptivo. |
| `git commit -m "Feature: Implementación del login con JWT"` |

### 3. Sincronizar al Remoto (`Push`) 

| Comando | Descripción |
| :--- | :--- |
| `git push -u origin main` | **Subir** los commits al repositorio (`origin`). El `-u` se usa establecer el seguimiento. |
| `git push` | Subir los commits en veces subsiguientes. |
| `git pull` | **Descargar** y fusionar los últimos cambios del repositorio remoto a la rama propia. |

---

## IV. Gestión de Ramas (`Branches`)

Las ramas estan dividas en nuestro integrantes , y tenemos como rama principal (`master`).

### 1. Ver y Cambiar de Ramas 

| Comando | Función |
| :--- | :--- |
| `git branch -a` | Lista todas las ramas (locales y remotas). |
| `git switch nombre-rama` | **Cambia** a una rama existente. |
| `git switch -c nueva-rama` | Crea y **cambia inmediatamente** a una nueva rama. |

| Pas
