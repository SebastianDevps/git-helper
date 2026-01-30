#!/usr/bin/env node
/**
 * Git Helper - Interactive CLI for branches and commits
 * Copyright (C) 2025 Sebastian Guerra
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License v3.0.
 * See LICENSE file or https://www.gnu.org/licenses/gpl-3.0.html
 */

const readline = require('readline');
const { execSync } = require('child_process');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const BRANCH_TYPES = [
  { name: 'feature', desc: 'Nueva funcionalidad' },
  { name: 'fix', desc: 'Corrección de bug' },
  { name: 'hotfix', desc: 'Corrección urgente en producción' },
  { name: 'refactor', desc: 'Refactorización de código' },
  { name: 'chore', desc: 'Tareas de mantenimiento' },
  { name: 'docs', desc: 'Documentación' },
  { name: 'test', desc: 'Tests' },
  { name: 'release', desc: 'Preparación de release' }
];

const COMMIT_TYPES = [
  { name: 'feat', desc: 'Nueva funcionalidad' },
  { name: 'fix', desc: 'Corrección de bug' },
  { name: 'refactor', desc: 'Refactorización' },
  { name: 'review', desc: 'Revisión de código' },
  { name: 'test', desc: 'Tests' },
  { name: 'docs', desc: 'Documentación' },
  { name: 'chore', desc: 'Mantenimiento' }
];

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

function showMenu(title, options) {
  console.log(`\n${title}:`);
  options.forEach((opt, idx) => {
    console.log(`  ${idx + 1}. ${opt.name}/ - ${opt.desc}`);
  });
}

async function createBranch() {
  console.log('\n🌿 CREAR BRANCH');
  showMenu('Selecciona el tipo de rama', BRANCH_TYPES);

  const branchTypeIdx = await question('\nElige una opción (1-8): ');
  const branchType = BRANCH_TYPES[parseInt(branchTypeIdx) - 1];

  if (!branchType) {
    console.log('❌ Opción inválida');
    return;
  }

  const taskId = await question('\nID de la tarea (ej: user-auth, s3-upload): ');

  if (!/^[a-z0-9-]+$/.test(taskId)) {
    console.log('❌ Solo se permiten minúsculas, números y guiones');
    return;
  }

  const branchName = `${branchType.name}/${taskId}`;
  const confirm = await question(`\n¿Crear branch "${branchName}"? (s/n): `);

  if (confirm.toLowerCase() === 's' || confirm.toLowerCase() === 'y') {
    try {
      execSync(`git checkout -b ${branchName}`, { stdio: 'inherit' });
      console.log(`✅ Branch "${branchName}" creado\n`);
    } catch (error) {
      console.error('❌ Error al crear branch. Verifica que no exista ya.\n');
    }
  }
}

async function createCommit() {
  console.log('\n📝 CREAR COMMIT');

  try {
    execSync('git diff --cached --quiet');
    console.log('⚠️  No hay cambios staged. Usa "git add" primero.\n');
    return;
  } catch {
    // Hay cambios staged, continuar
  }

  showMenu('Selecciona el tipo de commit', COMMIT_TYPES);

  const commitTypeIdx = await question('\nElige una opción (1-7): ');
  const commitType = COMMIT_TYPES[parseInt(commitTypeIdx) - 1];

  if (!commitType) {
    console.log('❌ Opción inválida');
    return;
  }

  const taskId = await question('\nID de tarea (ej: backend, MV-001): ');

  if (!taskId || taskId.length === 0) {
    console.log('❌ El ID de tarea es requerido');
    return;
  }

  // Validar formato de taskId (prevenir command injection)
  if (!/^[a-zA-Z0-9-]+$/.test(taskId)) {
    console.log('❌ Solo se permiten: letras, números y guiones');
    return;
  }

  const description = await question('\nDescripción del commit (en inglés, 5-100 caracteres): ');

  if (description.length < 5) {
    console.log('❌ Mínimo 5 caracteres');
    return;
  }
  if (description.length > 100) {
    console.log('❌ Máximo 100 caracteres');
    return;
  }

  // Validar que solo contiene caracteres seguros (prevenir command injection)
  if (!/^[a-zA-Z0-9 .,!?-]+$/.test(description)) {
    console.log('❌ Solo se permiten: letras, números, espacios y . , ! ? -');
    return;
  }

  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const commitMsg = `${commitType.name}|${taskId}|${date}|${description}`;

  console.log(`\n📝 Mensaje de commit generado:`);
  console.log(`   ${commitMsg}\n`);

  const confirm = await question('¿Ejecutar commit con este mensaje? (s/n): ');

  if (confirm.toLowerCase() === 's' || confirm.toLowerCase() === 'y') {
    try {
      // Escapar comillas dobles para prevenir command injection
      const escapedMsg = commitMsg.replace(/"/g, '\\"');
      execSync(`git commit -m "${escapedMsg}"`, { stdio: 'inherit' });
      console.log('\n✅ Commit creado exitosamente\n');
    } catch (error) {
      console.error('\n❌ Error al crear commit.\n');
    }
  }
}

async function main() {
  console.log('\n🚀 Git Helper - Automatización de branches y commits\n');
  console.log('¿Qué deseas hacer?');
  console.log('  1. Crear branch + commit');
  console.log('  2. Solo crear branch');
  console.log('  3. Solo hacer commit');

  const action = await question('\nElige una opción (1-3): ');

  switch(action) {
    case '1':
      await createBranch();
      await createCommit();
      break;
    case '2':
      await createBranch();
      break;
    case '3':
      await createCommit();
      break;
    default:
      console.log('❌ Opción inválida');
  }

  rl.close();
}

main().catch(error => {
  console.error('Error:', error);
  rl.close();
  process.exit(1);
});
