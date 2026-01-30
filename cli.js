#!/usr/bin/env node
/**
 * Git Commit Validator - CLI Installer
 * Copyright (C) 2025 Sebastian Guerra
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License v3.0.
 * See LICENSE file or https://www.gnu.org/licenses/gpl-3.0.html
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const COLORS = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${COLORS[color]}${message}${COLORS.reset}`);
}

function banner() {
  console.log('\n');
  log('╔════════════════════════════════════════════════════════╗', 'cyan');
  log('║                                                        ║', 'cyan');
  log('║    🚀 Git Commit Validator - Instalador v1.0        ║', 'cyan');
  log('║                                                        ║', 'cyan');
  log('╚════════════════════════════════════════════════════════╝', 'cyan');
  console.log('\n');
}

function checkGitRepo() {
  try {
    execSync('git rev-parse --git-dir', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

function checkPython() {
  try {
    execSync('python --version', { stdio: 'ignore' });
    return true;
  } catch {
    try {
      execSync('python3 --version', { stdio: 'ignore' });
      return true;
    } catch {
      return false;
    }
  }
}

function getTemplateContent(templateName) {
  const templates = {
    'commit-msg-hook': `#!/usr/bin/env python
import sys
import re

# Leer el mensaje de commit
with open(sys.argv[1], 'r', encoding='utf-8') as f:
    commit_msg = f.read().strip()

# Permitir commits especiales de Git (merge, revert, fixup, squash)
special_commits = r'^(Merge|Revert|Fixup|Squash|fixup!|squash!)'
if re.match(special_commits, commit_msg, re.IGNORECASE):
    sys.exit(0)

# Patrón del formato requerido (descripción de 5-100 caracteres, solo caracteres seguros)
pattern = r'^(feat|fix|refactor|review|test|docs|chore)\\|[a-zA-Z0-9-]+\\|\\d{8}\\|[a-zA-Z0-9 .,!?-]{5,100}$'

if not re.match(pattern, commit_msg):
    print("\\n❌ ERROR: Formato de commit inválido\\n", file=sys.stderr)
    print("📋 Formato requerido:", file=sys.stderr)
    print("   Tipo|IdTarea|YYYYMMDD|Descripción\\n", file=sys.stderr)
    print("📌 Tipos válidos: feat, fix, refactor, review, test, docs, chore\\n", file=sys.stderr)
    print("📝 Descripción: 5-100 caracteres (letras, números, espacios, . , ! ? -)\\n", file=sys.stderr)
    print("✅ Ejemplo válido:", file=sys.stderr)
    print("   feat|backend|20250129|Add user authentication\\n", file=sys.stderr)
    print("ℹ️  Commits de merge/revert/fixup/squash están permitidos sin formato\\n", file=sys.stderr)
    print("❌ Tu commit:", file=sys.stderr)
    print(f"   {commit_msg}\\n", file=sys.stderr)
    sys.exit(1)

sys.exit(0)
`,
    'github-workflow': `name: Validate Commits

on:
  pull_request:
    branches: [develop, main, master]

jobs:
  validate-commits:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Validate commit messages
        run: |
          commits=$(git log --format=%H \${{ github.event.pull_request.base.sha }}..\${{ github.event.pull_request.head.sha }})
          pattern="^(feat|fix|refactor|review|test|docs|chore)\\|[a-zA-Z0-9-]+\\|[0-9]{8}\\|[a-zA-Z0-9 .,!?-]{5,100}$"
          special_pattern="^(Merge|Revert|Fixup|Squash|fixup!|squash!)"
          invalid_commits=""

          for commit in $commits; do
            msg=$(git log --format=%B -n 1 $commit | head -n 1)
            # Skip special commits (merge, revert, fixup, squash)
            if echo "$msg" | grep -qiE "$special_pattern"; then
              continue
            fi
            # Validate normal commits
            if ! echo "$msg" | grep -qE "$pattern"; then
              invalid_commits="$invalid_commits\\n- $commit: $msg"
            fi
          done

          if [ -n "$invalid_commits" ]; then
            echo "❌ Commits con formato inválido:"
            echo -e "$invalid_commits"
            echo "📋 Formato: Tipo|IdTarea|YYYYMMDD|Descripción (5-100 caracteres)"
            echo "ℹ️  Commits de merge/revert/fixup/squash están permitidos sin formato"
            exit 1
          fi
          echo "✅ Todos los commits válidos"
`,
    'documentation': `# 📋 Git Commit Validator

Sistema de validación automática de commits instalado.

## Formato Requerido

\`\`\`
Tipo|IdTarea|YYYYMMDD|Descripción
\`\`\`

**Tipos:** feat, fix, refactor, review, test, docs, chore

**Ejemplos:**
\`\`\`bash
feat|backend|20250129|Add user authentication
fix|MV-001|20250129|Fix login validation
chore|backend|20250129|Update dependencies
\`\`\`

## Uso

\`\`\`bash
# Commits automáticos (validados)
git commit -m "feat|backend|20250129|Add feature"

# CLI interactivo
git-helper
\`\`\`

## Tipos de Ramas

- feature/ - Nueva funcionalidad
- fix/ - Corrección de bug
- hotfix/ - Corrección urgente
- refactor/ - Refactorización
- chore/ - Mantenimiento
- docs/ - Documentación
- test/ - Tests
- release/ - Preparación de release

Instalado con: @mv/git-commit-validator
`
  };

  return templates[templateName];
}

function createHook() {
  const hookContent = getTemplateContent('commit-msg-hook');
  const hookPath = '.git/hooks/commit-msg';

  // Backup de hook existente si ya existe
  if (fs.existsSync(hookPath)) {
    const timestamp = Date.now();
    const backupPath = `${hookPath}.backup-${timestamp}`;
    fs.copyFileSync(hookPath, backupPath);
    log(`⚠️  Hook existente respaldado en: ${backupPath}`, 'yellow');
  }

  fs.writeFileSync(hookPath, hookContent, { mode: 0o755 });
  log('✅ Hook instalado en .git/hooks/commit-msg', 'green');
}

function createGitHelper() {
  // Copiar el git-helper.js del paquete al proyecto
  const sourceHelper = path.join(__dirname, 'git-helper.js');
  const targetDir = 'scripts';
  const targetHelper = path.join(targetDir, 'git-helper.js');

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  fs.copyFileSync(sourceHelper, targetHelper);
  log('✅ Git helper instalado en scripts/git-helper.js', 'green');
}

function updatePackageJson() {
  const packageJsonPath = 'package.json';
  let packageJson;

  if (!fs.existsSync(packageJsonPath)) {
    packageJson = {
      name: path.basename(process.cwd()),
      version: '1.0.0',
      scripts: {}
    };
  } else {
    packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  }

  if (!packageJson.scripts) {
    packageJson.scripts = {};
  }

  packageJson.scripts['git:helper'] = 'node scripts/git-helper.js';

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  log('✅ package.json actualizado', 'green');
}

function createGitHubWorkflow() {
  const workflowContent = getTemplateContent('github-workflow');
  const workflowDir = '.github/workflows';

  if (!fs.existsSync(workflowDir)) {
    fs.mkdirSync(workflowDir, { recursive: true });
  }

  fs.writeFileSync(
    path.join(workflowDir, 'validate-commits.yml'),
    workflowContent
  );
  log('✅ GitHub Actions workflow creado', 'green');
}

function createDocs() {
  const docContent = getTemplateContent('documentation');
  const docsDir = 'docs';

  if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir, { recursive: true });
  }

  fs.writeFileSync(
    path.join(docsDir, 'GIT_VALIDATOR.md'),
    docContent
  );
  log('✅ Documentación creada en docs/', 'green');
}

function uninstall() {
  banner();

  // Verificar que estamos en un repo git
  if (!checkGitRepo()) {
    log('❌ Error: No es un repositorio git', 'red');
    process.exit(1);
  }

  log('🗑️  Desinstalando Git Commit Validator...', 'blue');
  console.log('');

  try {
    const hookPath = '.git/hooks/commit-msg';
    let removed = false;

    // Restaurar backup si existe
    const backups = fs.readdirSync('.git/hooks')
      .filter(f => f.startsWith('commit-msg.backup-'))
      .sort()
      .reverse();

    if (backups.length > 0) {
      const latestBackup = path.join('.git/hooks', backups[0]);
      fs.copyFileSync(latestBackup, hookPath);
      log(`✅ Hook restaurado desde: ${backups[0]}`, 'green');

      // Eliminar backups
      backups.forEach(backup => {
        fs.unlinkSync(path.join('.git/hooks', backup));
      });
      log('✅ Backups eliminados', 'green');
      removed = true;
    } else if (fs.existsSync(hookPath)) {
      // No hay backup, solo eliminar hook actual
      fs.unlinkSync(hookPath);
      log('✅ Hook eliminado', 'green');
      removed = true;
    }

    // Eliminar git-helper script
    if (fs.existsSync('scripts/git-helper.js')) {
      fs.unlinkSync('scripts/git-helper.js');
      log('✅ Git helper eliminado', 'green');
      removed = true;

      // Eliminar carpeta scripts si está vacía
      const scriptsDir = 'scripts';
      if (fs.existsSync(scriptsDir) && fs.readdirSync(scriptsDir).length === 0) {
        fs.rmdirSync(scriptsDir);
      }
    }

    // Eliminar documentación
    if (fs.existsSync('docs/GIT_VALIDATOR.md')) {
      fs.unlinkSync('docs/GIT_VALIDATOR.md');
      log('✅ Documentación eliminada', 'green');
      removed = true;
    }

    // Eliminar workflow de GitHub Actions
    const workflowPath = '.github/workflows/validate-commits.yml';
    if (fs.existsSync(workflowPath)) {
      fs.unlinkSync(workflowPath);
      log('✅ GitHub Actions workflow eliminado', 'green');
      removed = true;
    }

    // Limpiar package.json
    const packageJsonPath = 'package.json';
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      if (packageJson.scripts && packageJson.scripts['git:helper']) {
        delete packageJson.scripts['git:helper'];
        fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
        log('✅ package.json limpiado', 'green');
        removed = true;
      }
    }

    console.log('');
    if (removed) {
      log('╔════════════════════════════════════════════════════════╗', 'green');
      log('║                                                        ║', 'green');
      log('║       ✅ Desinstalación completada exitosamente      ║', 'green');
      log('║                                                        ║', 'green');
      log('╚════════════════════════════════════════════════════════╝', 'green');
    } else {
      log('⚠️  No se encontraron archivos del validador', 'yellow');
    }
    console.log('');

  } catch (error) {
    log(`\n❌ Error: ${error.message}`, 'red');
    process.exit(1);
  }
}

async function main() {
  // Check for uninstall flag
  if (process.argv.includes('--uninstall')) {
    uninstall();
    return;
  }

  banner();

  // Verificar que estamos en un repo git
  if (!checkGitRepo()) {
    log('❌ Error: No es un repositorio git', 'red');
    log('   Ejecuta "git init" primero', 'yellow');
    process.exit(1);
  }

  // Verificar Python
  if (!checkPython()) {
    log('⚠️  Advertencia: Python no detectado', 'yellow');
    log('   El hook requiere Python instalado', 'yellow');
    log('   Descarga desde: https://www.python.org/downloads/', 'cyan');
    console.log('');
  }

  log('📦 Instalando Git Commit Validator...', 'blue');
  console.log('');

  try {
    log('1️⃣  Creando hook de validación...', 'blue');
    createHook();
    console.log('');

    log('2️⃣  Instalando git helper...', 'blue');
    createGitHelper();
    console.log('');

    log('3️⃣  Actualizando package.json...', 'blue');
    updatePackageJson();
    console.log('');

    log('4️⃣  Creando GitHub Actions workflow...', 'blue');
    createGitHubWorkflow();
    console.log('');

    log('5️⃣  Creando documentación...', 'blue');
    createDocs();
    console.log('');

    log('╔════════════════════════════════════════════════════════╗', 'green');
    log('║                                                        ║', 'green');
    log('║       ✅ Instalación completada exitosamente         ║', 'green');
    log('║                                                        ║', 'green');
    log('╚════════════════════════════════════════════════════════╝', 'green');
    console.log('');

    log('🎯 Próximos pasos:', 'cyan');
    log('   1. git-helper              → CLI interactivo', 'white');
    log('   2. git commit -m "..."     → Validación automática', 'white');
    log('   3. cat docs/GIT_VALIDATOR.md → Ver documentación', 'white');
    console.log('');

    log('📋 Formato de commit:', 'cyan');
    log('   Tipo|IdTarea|YYYYMMDD|Descripción', 'white');
    log('   Ejemplo: feat|backend|20250129|Add feature', 'yellow');
    console.log('');

  } catch (error) {
    log(`\n❌ Error: ${error.message}`, 'red');
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { main, uninstall };
