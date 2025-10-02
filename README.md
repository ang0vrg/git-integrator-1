# 🚀 Git Esencial: Flujo de Trabajo Efectivo

## 📋 Proyecto: Sistema Web - Pastelería La Casa del Chantilly

**Descripción:** Sistema web para gestionar ventas, pedidos, catálogo de productos, promociones y fidelización de clientes.

**Tecnologías:** 
- 🟨 **Backend:** Quarkus, Maven
- ⚛️ **Frontend:** React, Typescript, Sass, TailwindCSS  
- 🗄️ **Base de Datos:** MySQL, Docker
- 📦 **Recursos:** JWT, Google Guava, Apache POI, Apache Commons, Logback, Lombok

---

## ⚙️ I. Configuración Inicial del Repositorio

| Comando | Descripción | Ejemplo |
|---------|-------------|---------|
| `git config --global user.name "TuNombre"` | 🏷️ Establece nombre para commits | `git config --global user.name "Angel"` |
| `git config --global user.email "tu@email.com"` | 📧 Establece email para commits | `git config --global user.email "angel.vargas.uni@gmail.com"` |
| `git init` | 🆕 Inicializa repositorio local | `git init` |
| `git remote add origin [URL]` | 🔗 Vincula repositorio remoto | `git remote add origin https://github.com/ang0vrg/git-integrator-1/` |
| `git remote -v` | 👁️ Verifica URL remota configurada | `git remote -v` |
| `git branch` | Listar ramas locales | `git branch -a` |
| `git branch -a` | Listar ramas locales y remotas | `git branch -a` |
| `git checkout -b <nombre-rama>` | Crear y cambiar a nueva rama | `git checkout -b Angel` |
| `git branch -m <nuevo-nombre>` | Renombrar rama actual | `git branch -m Vargas` |
| `git clean -f` | Eliminar archivos no trackeados | `git clean -f` |
| `git clean -fd` | Eliminar archivos y directorios no trackeados | `git clean -fd` |
| `git clean -n` | Simular limpieza (ver qué se eliminaría) | `git clean -n` |
| `git add .` | Agregar todos los archivos modificados | `git add .` |
| `git add -p` | Agregar cambios interactivamente | `git add -p` |
| `git add -u` | Agregar solo archivos trackeados | `git add -u` |
| `git commit -m "<ejemplo>"` | Commit con mensaje | `git commit -m "feat: implementar sistema de autenticación"` |
| `git commit -am "<ejemplo>"` | Commit que incluye cambios staged automáticamente | `git commit -am "fix: corregir error en cálculo de total"` |
| `git commit --allow-empty -m "<ejemplo>"` | Commit vacío (útil para triggers) | `git commit --allow-empty -m "chore: trigger deployment"` |
| `git push origin main` | Subir cambios a rama principal | `git push origin main` |
| `git push origin <SubRama>` | Subir cambios a rama específica | `git push origin Angel` |
| `git push --force origin main` | Forzar push (¡USAR CON CUIDADO!) | `git push --force origin main` |
| `git push -u origin <nueva-rama>` | Subir rama local y establecer upstream | `git push -u origin Vargas` |
| `git checkout -- <ejemplo>` | Deshacer cambios en archivo (antes de staging) | `git checkout -- archivo.js` |
| `git reset HEAD <ejemplo>` | Remover archivo del staging area | `git reset HEAD archivo.js` |
| `git reset --hard HEAD` | Deshacer todos los cambios locales (¡CUIDADO!) | `git reset --hard HEAD` |
| `git reset --soft HEAD~1` | Deshacer último commit manteniendo cambios en working directory | `git reset --soft HEAD~1` |
| `git reset --hard HEAD~1` | Deshacer último commit eliminando cambios | `git reset --hard HEAD~1` |
| `git branch -d <nombre-rama>` | Eliminar rama local | `git branch -D Angel` |
| `git branch -D <nombre-rama>` | Forzar eliminación de rama local | `git branch -D Angel` |
| `git push origin --delete nombre-rama` | Eliminar rama remota | `git push origin --delete Angel` |
| `git status` | Estado actual del repositorio | `git status` |
| `git log` | Historial de commits | `git log` |
| `git log --oneline` | Historial compacto | `git log --oneline` |
| `git log --oneline --graph --all` | Historial con gráfico de ramas | `git log --oneline --graph --all` |
| `git show <commit-hash>` | Ver cambios específicos de un commit | `git show <commit-hash>` |
| `git diff <commit1> <commit2>` | Ver cambios entre commits | `git diff <commit1> <commit2>` |
---

## 🔄 II. Flujo de Trabajo Diario

### 🔄 Ciclo Básico de Desarrollo

```bash
# 1. 📥 Actualizar desde remoto
git pull origin main

# 2. ✨ Preparar cambios
git add .

# 3. 💾 Guardar cambios
git commit -m "feat: implementación login con JWT"

# 4. 🚀 Subir cambios
git push origin main
```

---

## 📦 III. Comandos NPM y Gestión de Dependencias

### 🧹 Comandos de Limpieza y Compilación

```bash
# Limpiar node_modules y reinstalar (equivalente a clean)
rm -rf node_modules package-lock.json && npm install

# Compilar en modo desarrollo
npm run dev

# Compilar para producción
npm run build

# Ver build de producción
npm run preview

# Ejecutar linter
npm run lint
```

### 📥 Instalación de Módulos Esenciales

#### 🔧 Dependencias Principales
```bash
# Navegación y estado
npm install react-router-dom zustand

# Formularios y validación
npm install react-hook-form @hookform/resolvers yup

# HTTP Client
npm install axios

# UI y Utilidades
npm install lucide-react clsx tailwind-merge
npm install @headlessui/react

# Manejo de fechas
npm install date-fns

# Autenticación y seguridad
npm install js-cookie jwt-decode

# Tablas y datos
npm install @tanstack/react-table

# Componentes y animaciones
npm install class-variance-authority tailwindcss-animate

# Responsive design
npm install react-responsive
```

#### 🎯 Comando de Instalación Completo
```bash
npm install react-router-dom zustand react-hook-form @hookform/resolvers yup axios lucide-react clsx tailwind-merge @headlessui/react date-fns js-cookie jwt-decode @tanstack/react-table class-variance-authority tailwindcss-animate react-responsive
```

---

## 🗄️ IV. Configuración de Base de Datos MySQL

### 📊 Comandos SQL Básicos
```sql
-- Conectar a MySQL
mysql -u root -p

-- Crear base de datos para el proyecto
mysql -u root -p bakerychantillydb < bakerychantillydb.sql

-- Otorgar privilegios
GRANT ALL PRIVILEGES ON pasteleria_chantilly.* TO 'chantilly_user'@'localhost';
FLUSH PRIVILEGES;

-- Usar la base de datos
USE bakerychantillydb;
```

---

## 🚀 V. Flujo de Desarrollo Rápido

### 🔄 Comandos Esenciales Diarios
```bash
# 1. 🧹 Limpiar e instalar dependencias
npm run clean:install

# 2. 🛠️ Ejecutar en modo desarrollo
npm run dev

# 3. 📦 Compilar para producción
npm run build

# 4. 👀 Verificar build de producción
npm run preview

# 5. ✅ Verificar tipos TypeScript
npm run type-check
```

---

## 📝 VIII. Convenciones de Commits

| Tipo | Descripción | Ejemplo |
|------|-------------|---------|
| `feat` | Nueva funcionalidad | `feat: agregar sistema de carrito` |
| `fix` | Corrección de bugs | `fix: resolver error en cálculo de total` |
| `docs` | Documentación | `docs: actualizar README.md` |
| `style` | Cambios de formato | `style: ajustar responsive en móviles` |
| `refactor` | Refactorización | `refactor: optimizar hook useProducts` |
| `test` | Pruebas | `test: agregar tests para login` |
| `chore` | Tareas de mantenimiento | `chore: actualizar dependencias` |

---
