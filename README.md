# 🚀 Git Commit Validator

Sistema de validación automática de commits con formato personalizado y CLI interactivo para gestión de ramas.

[![npm version](https://img.shields.io/npm/v/@sebastiandevp/git-commit-validator.svg)](https://www.npmjs.com/package/@sebastiandevp/git-commit-validator)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ Características

- ✅ **Validación automática** de formato de commits
- 🎯 **CLI interactivo** para crear branches y commits
- 🌿 **8 tipos de ramas** predefinidos
- 🔄 **GitHub Actions** incluido para validación en PRs
- 📝 **Sin dependencias** - Solo Node.js y Python
- ⚡ **Instalación en segundos**

---

## 📦 Instalación

### Instalación Rápida (Recomendada)

```bash
npx @sebastiandevp/git-commit-validator
```

### Instalación Global

```bash
npm install -g @sebastiandevp/git-commit-validator
setup-git-validator
```

### Como Dependencia de Desarrollo

```bash
npm install --save-dev @sebastiandevp/git-commit-validator
# o
yarn add -D @sebastiandevp/git-commit-validator

# Luego ejecuta:
npx setup-git-validator
```

---

## 🎯 Formato de Commits

El validador requiere el siguiente formato:

```
Tipo|IdTarea|YYYYMMDD|Descripción
```

### Tipos Válidos

| Tipo | Descripción | Ejemplo |
|------|-------------|---------|
| `feat` | Nueva funcionalidad | `feat\|backend\|20250129\|Add user authentication` |
| `fix` | Corrección de bug | `fix\|MV-001\|20250129\|Fix login validation` |
| `refactor` | Refactorización | `refactor\|backend\|20250129\|Optimize database queries` |
| `review` | Cambios de code review | `review\|backend\|20250129\|Apply PR feedback` |
| `test` | Tests | `test\|backend\|20250129\|Add unit tests for auth` |
| `docs` | Documentación | `docs\|backend\|20250129\|Update API documentation` |
| `chore` | Mantenimiento | `chore\|backend\|20250129\|Update dependencies` |

### ⚠️ Commits Especiales (Sin Formato)

Estos commits **NO requieren el formato** y son permitidos automáticamente:
- Merge commits: `Merge branch 'develop' into main`
- Revert commits: `Revert "feat|backend|20250129|Add feature"`
- Fixup commits: `fixup! Previous commit`
- Squash commits: `squash! Combine commits`

### Ejemplos de Commits Válidos

```bash
feat|backend|20250129|Add JWT authentication system
fix|MV-001|20250129|Fix memory leak in cache service
refactor|backend|20250129|Simplify user validation logic
test|backend|20250129|Add E2E tests for checkout flow
docs|backend|20250129|Add architecture decision records
chore|backend|20250129|Upgrade TypeScript to v5.3
```

---

## 🛠️ Uso

### Commits Automáticos

Una vez instalado, el hook valida automáticamente cada commit:

```bash
# ✅ Commit válido - será aceptado
git commit -m "feat|backend|20250129|Add user registration"

# ❌ Commit inválido - será rechazado
git commit -m "added new feature"
```

### CLI Interactivo

Usa el helper para crear branches y commits fácilmente:

```bash
git-helper
# o si lo instalaste localmente:
npx git-helper
```

El CLI te guiará paso a paso:

```
🚀 Git Helper - Automatización de branches y commits

¿Qué deseas hacer?
  1. Crear branch + commit
  2. Solo crear branch
  3. Solo hacer commit

Elige una opción (1-3): 2

🌿 CREAR BRANCH

Selecciona el tipo de rama:
  1. feature/ - Nueva funcionalidad
  2. fix/ - Corrección de bug
  3. hotfix/ - Corrección urgente en producción
  4. refactor/ - Refactorización de código
  5. chore/ - Tareas de mantenimiento
  6. docs/ - Documentación
  7. test/ - Tests
  8. release/ - Preparación de release

Elige una opción (1-8): 1

ID de la tarea (ej: user-auth, s3-upload): user-authentication

¿Crear branch "feature/user-authentication"? (s/n): s
✅ Branch "feature/user-authentication" creado
```

---

## 🌿 Tipos de Ramas

El CLI ofrece 8 tipos de ramas:

| Prefijo | Uso | Ejemplo |
|---------|-----|---------|
| `feature/` | Nueva funcionalidad | `feature/user-authentication` |
| `fix/` | Corrección de bug | `fix/login-validation` |
| `hotfix/` | Corrección urgente | `hotfix/security-vulnerability` |
| `refactor/` | Refactorización | `refactor/database-queries` |
| `chore/` | Mantenimiento | `chore/update-dependencies` |
| `docs/` | Documentación | `docs/api-documentation` |
| `test/` | Tests | `test/integration-tests` |
| `release/` | Preparación release | `release/v1.2.0` |

---

## 🔄 GitHub Actions

El instalador crea automáticamente un workflow de GitHub Actions que valida commits en Pull Requests:

**Archivo creado:** `.github/workflows/validate-commits.yml`

El workflow se ejecuta automáticamente en PRs hacia `develop`, `main` o `master`.

---

## 📚 Documentación Generada

Después de la instalación, encontrarás:

- `docs/GIT_VALIDATOR.md` - Documentación completa del sistema
- `scripts/git-helper.js` - Script CLI para uso local
- `.git/hooks/commit-msg` - Hook de validación

---

## 🧪 Verificar Instalación

```bash
# 1. Probar commit inválido
git commit --allow-empty -m "test"
# Esperado: ❌ ERROR: Formato de commit inválido

# 2. Probar commit válido
git commit --allow-empty -m "test|backend|20250129|Test validation"
# Esperado: ✅ Commit creado

# 3. Probar CLI
git-helper
# Esperado: Menú interactivo

# 4. Correr tests (para desarrolladores)
npm test
# Esperado: ✅ All tests passed
```

---

## ⚙️ Requisitos

- **Node.js** >= 14.0.0
- **Python** 3.x (para el hook de validación)
- **Git** repository inicializado

### Instalar Python

Si no tienes Python:

- **Windows**: https://www.python.org/downloads/
- **macOS**: `brew install python3`
- **Linux**: `sudo apt install python3` o `sudo yum install python3`

---

## 🔧 Configuración Avanzada

### Desinstalar

Para desinstalar completamente el validador:

```bash
npx @sebastiandevp/git-commit-validator --uninstall
```

Esto:
- Restaura el hook anterior (si existe backup)
- Elimina scripts y documentación instalados
- Limpia package.json
- Remueve el GitHub Actions workflow

### Personalizar el Formato

Para personalizar el formato de commits, edita `.git/hooks/commit-msg` después de la instalación.

### Bypass de Validación

**Nota:** Los commits especiales (Merge, Revert, Fixup, Squash) están **permitidos automáticamente** sin formato.

#### Para Commits Individuales

```bash
# Usar --no-verify cuando sea necesario
git commit --no-verify -m "Mensaje sin formato"

# Alias corto
git commit -n -m "Mensaje sin formato"
```

#### Casos de Uso Legítimos

- **Emergencias:** Hotfixes críticos que no pueden esperar
- **WIP commits:** Trabajo en progreso en branches personales
- **Commits automáticos:** Generados por herramientas

**⚠️ Importante:** Usar con moderación. Los commits sin formato dificultan el seguimiento del historial.

### Reinstalar

```bash
npx @sebastiandevp/git-commit-validator
```

---

## 🛠️ Solución de Problemas

### El hook no funciona

```bash
# 1. Verificar que el hook existe
ls -la .git/hooks/commit-msg

# 2. Verificar permisos
chmod +x .git/hooks/commit-msg

# 3. Reinstalar
npx @sebastiandevp/git-commit-validator
```

### Python no encontrado

```bash
# Verificar instalación
python --version
# o
python3 --version

# Si no está instalado, descárgalo de python.org
```

### El CLI no funciona

```bash
# Verificar que el script existe
ls -la scripts/git-helper.js

# Ejecutar directamente con node
node scripts/git-helper.js
```

---

## 📝 Scripts en package.json

Después de la instalación, tendrás disponible:

```json
{
  "scripts": {
    "git:helper": "node scripts/git-helper.js"
  }
}
```

Úsalo con:

```bash
npm run git:helper
# o
yarn git:helper
```

---

## 🤝 Contribuir

¿Encontraste un bug o tienes una sugerencia?

1. Abre un issue: https://github.com/SebastianDevps/git-helper/issues
2. Envía un PR con tus cambios

**Nota:** Este proyecto está bajo GPL-3.0, cualquier contribución debe ser compatible con esta licencia.

---

## 📄 Licencia

GPL-3.0 © 2025 Sebastian Guerra

Este proyecto está licenciado bajo GNU General Public License v3.0.
Esto significa que puedes usar, modificar y distribuir este software,
pero cualquier modificación debe ser también open source bajo GPL-3.0.

Ver [LICENSE](LICENSE) para más detalles.

---

## 🔗 Links

- [GitHub](https://github.com/SebastianDevps/git-helper)
- [npm](https://www.npmjs.com/package/@sebastiandevp/git-commit-validator)
- [Documentación completa](https://github.com/SebastianDevps/git-helper#readme)

---

## ⭐ ¿Te resultó útil?

¡Dale una estrella en GitHub! ⭐

---

**Hecho con ❤️ para mejorar la calidad de commits en equipos de desarrollo**
