/**
 * Tests for the Python hook validator
 * Copyright (C) 2025 Sebastian Guerra
 * Licensed under GPL-3.0 - see LICENSE file
 *
 * Tests the actual hook logic by spawning Python process
 * Run with: node tests/hook-validator.test.js
 */

const assert = require('assert');
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

// Hook Python code (from cli.js template)
const HOOK_CODE = `#!/usr/bin/env python
import sys
import re

# Leer el mensaje de commit
with open(sys.argv[1], 'r', encoding='utf-8') as f:
    commit_msg = f.read().strip()

# Permitir commits especiales de Git (merge, revert, fixup, squash)
special_commits = r'^(Merge|Revert|Fixup|Squash|fixup!|squash!)'
if re.match(special_commits, commit_msg, re.IGNORECASE):
    sys.exit(0)

# Patrón del formato requerido
pattern = r'^(feat|fix|refactor|review|test|docs|chore)\\|[a-zA-Z0-9-]+\\|\\d{8}\\|[a-zA-Z0-9 .,!?-]{5,100}$'

if not re.match(pattern, commit_msg):
    print("\\n❌ ERROR: Formato de commit inválido\\n", file=sys.stderr)
    sys.exit(1)

sys.exit(0)
`;

function testHookWithMessage(msg, shouldPass, description) {
  // Create temp file with commit message
  const tmpDir = os.tmpdir();
  const tmpFile = path.join(tmpDir, `commit-msg-test-${Date.now()}.txt`);
  fs.writeFileSync(tmpFile, msg, 'utf8');

  // Create temp hook file
  const hookFile = path.join(tmpDir, `hook-${Date.now()}.py`);
  fs.writeFileSync(hookFile, HOOK_CODE, 'utf8');

  try {
    // Run Python hook with temp file
    const result = spawnSync('python', [hookFile, tmpFile], {
      encoding: 'utf8'
    });

    const passed = result.status === 0;

    assert.strictEqual(passed, shouldPass,
      `${description}\n  Message: "${msg}"\n  Expected: ${shouldPass ? 'PASS' : 'FAIL'}\n  Got: ${passed ? 'PASS' : 'FAIL'}\n  Exit code: ${result.status}`
    );

    console.log(`✅ ${description}`);
  } catch (error) {
    console.error(`❌ ${error.message}`);
    process.exitCode = 1;
  } finally {
    // Cleanup
    try {
      fs.unlinkSync(tmpFile);
      fs.unlinkSync(hookFile);
    } catch (e) {
      // Ignore cleanup errors
    }
  }
}

function checkPython() {
  const result = spawnSync('python', ['--version'], { encoding: 'utf8' });
  return result.status === 0;
}

console.log('\n🧪 Testing Python Hook Validator\n');

// Check if Python is available
if (!checkPython()) {
  console.warn('⚠️  Python not found, skipping hook tests');
  console.log('   Install Python from: https://www.python.org/downloads/\n');
  process.exit(0);
}

// ✅ VALID COMMITS
console.log('📋 Valid Commits:');
testHookWithMessage(
  'feat|backend|20250129|Add user authentication',
  true,
  'Standard feature commit'
);
testHookWithMessage(
  'fix|MV-001|20250130|Fix critical security bug',
  true,
  'Bug fix with task ID'
);

// ✅ SPECIAL COMMITS
console.log('\n📋 Special Commits:');
testHookWithMessage(
  'Merge branch develop into main',
  true,
  'Merge commit'
);
testHookWithMessage(
  'Revert "feat|backend|20250129|Add feature"',
  true,
  'Revert commit'
);

// ❌ INVALID COMMITS
console.log('\n📋 Invalid Commits:');
testHookWithMessage(
  'added new feature',
  false,
  'No format structure'
);
testHookWithMessage(
  'feat|backend|20250129|Four',
  false,
  'Description too short'
);
testHookWithMessage(
  'feat|backend|20250129|Has "quotes" in text',
  false,
  'Invalid character: quotes'
);

console.log('\n✅ Hook tests completed!\n');

if (process.exitCode === 1) {
  console.error('❌ Some tests failed\n');
} else {
  console.log('🎉 All hook tests passed!\n');
}
