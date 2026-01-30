# Changelog

## [1.2.0] - 2025-01-30

### 📜 License & Copyright

- **Changed License: MIT → GPL-3.0**
  - Strong copyleft protection
  - Requires derivative works to be open source
  - Prevents proprietary closed-source modifications

- **Author: Sebastian Guerra**
  - Copyright headers added to all source files
  - GPL-3.0 license headers in cli.js, git-helper.js, index.js
  - License headers in all test files

### 🧪 Testing Suite Enhanced

- **Edge Cases Tests** (`tests/edge-cases.test.js`)
  - 50+ edge cases tested
  - Boundary tests (min/max lengths)
  - Date format variations
  - TaskID edge cases
  - Security injection attempts
  - Unicode/encoding validation
  - Whitespace handling

- **Stress Tests** (`tests/stress.test.js`)
  - 60,000+ validations tested
  - Performance: Up to 1M ops/sec
  - Memory leak detection (stable)
  - High volume: 10k commits validated
  - Regex backtracking DoS prevention
  - Concurrent load simulation

- **Test Scripts Added**
  - `npm run test:edge` - Edge cases
  - `npm run test:stress` - Performance tests
  - `npm test` - Runs ALL tests (regex + edge + hook + stress)

### 📊 Performance Validated

- ✅ 60,000+ commit validations tested
- ✅ No memory leaks detected
- ✅ Regex catastrophic backtracking tested
- ✅ High concurrency simulation passed
- ✅ All edge cases handled correctly

---

## [1.1.0] - 2025-01-30

### 🔒 Seguridad

- **FIXED: Command Injection en git-helper.js**
  - Sanitización de inputs de usuario (taskId y description)
  - Validación estricta de caracteres permitidos
  - Escape de comillas en comandos git

- **FIXED: Hook Backup**
  - Ahora hace backup de hooks existentes antes de sobrescribir
  - Protege hooks de Husky, pre-commit y otras herramientas

### ✨ Features

- **Whitelist de Commits Especiales**
  - Merge commits permitidos sin formato: `Merge branch 'develop'`
  - Revert commits permitidos: `Revert "feat|..."`
  - Fixup/Squash commits permitidos para rebase interactivo
  - Actualizado en hook Python Y GitHub Actions workflow

- **Comando de Desinstalación**
  - `npx @mv-team/git-commit-validator --uninstall`
  - Restaura hooks anteriores desde backup
  - Limpia todos los archivos instalados
  - Remueve scripts de package.json

### 🧪 Testing

- **Suite de Tests Completa**
  - `tests/regex.test.js`: 21 casos de test del regex
  - `tests/hook-validator.test.js`: Tests del hook Python real
  - Scripts npm: `npm test`, `npm run test:regex`, `npm run test:hook`
  - Tests corren antes de publicar (`prepublishOnly`)

### 🔧 Mejoras

- **Regex de Descripción Mejorado**
  - Antes: `.{5,60}` (cualquier carácter)
  - Ahora: `[a-zA-Z0-9 .,!?-]{5,100}` (caracteres seguros)
  - Límite aumentado de 60 a 100 caracteres
  - Previene caracteres peligrosos: comillas, backticks, $()

- **Sincronización de Regex**
  - Hook Python y GitHub Actions usan MISMO regex
  - Validación consistente en local y CI/CD

- **Validación de Inputs en CLI**
  - taskId: solo alfanuméricos y guiones
  - description: caracteres seguros validados antes de commit

### 📚 Documentación

- **README Actualizado**
  - Documentación de commits especiales permitidos
  - Instrucciones de desinstalación
  - Información sobre tests

- **CHANGELOG Agregado**
  - Historial de cambios para cada versión

---

## [1.0.1] - 2025-01-29

### Initial Release

- Validación automática de commits con hook Python
- CLI interactivo (git-helper) para crear branches y commits
- 8 tipos de ramas predefinidos
- GitHub Actions workflow para validación en PRs
- Documentación completa
