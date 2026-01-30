/**
 * Tests for commit message validation regex
 * Copyright (C) 2025 Sebastian Guerra
 * Licensed under GPL-3.0 - see LICENSE file
 *
 * Run with: node tests/regex.test.js
 */

const assert = require('assert');

// Patrón del hook (línea 68 de cli.js)
const COMMIT_PATTERN = /^(feat|fix|refactor|review|test|docs|chore)\|[a-zA-Z0-9-]+\|\d{8}\|[a-zA-Z0-9 .,!?-]{5,100}$/;
const SPECIAL_PATTERN = /^(Merge|Revert|Fixup|Squash|fixup!|squash!)/i;

function testCommitMessage(msg, shouldPass, description) {
  // Verificar si es un commit especial (siempre permitido)
  const isSpecial = SPECIAL_PATTERN.test(msg);
  const matchesPattern = COMMIT_PATTERN.test(msg);
  const passes = isSpecial || matchesPattern;

  try {
    assert.strictEqual(passes, shouldPass,
      `${description}\n  Message: "${msg}"\n  Expected: ${shouldPass ? 'PASS' : 'FAIL'}\n  Got: ${passes ? 'PASS' : 'FAIL'}`
    );
    console.log(`✅ ${description}`);
  } catch (error) {
    console.error(`❌ ${error.message}`);
    process.exitCode = 1;
  }
}

console.log('\n🧪 Testing Commit Message Validation\n');

// ✅ VALID COMMITS
console.log('📋 Valid Commits:');
testCommitMessage(
  'feat|backend|20250129|Add user authentication',
  true,
  'Standard feature commit'
);
testCommitMessage(
  'fix|MV-001|20250130|Fix login validation error',
  true,
  'Bug fix with task ID'
);
testCommitMessage(
  'refactor|backend|20250129|Optimize database queries',
  true,
  'Refactor commit'
);
testCommitMessage(
  'test|backend|20250129|Add unit tests for auth module',
  true,
  'Test commit with longer description'
);
testCommitMessage(
  'docs|backend|20250129|Update API documentation with new endpoints and examples',
  true,
  'Documentation with 60+ chars'
);
testCommitMessage(
  'chore|deps|20250129|Bump version to 2.0.0',
  true,
  'Chore with version number'
);
testCommitMessage(
  'review|PR-123|20250129|Apply code review feedback',
  true,
  'Review commit'
);

// ✅ SPECIAL COMMITS (allowed without format)
console.log('\n📋 Special Commits (Merge, Revert, etc.):');
testCommitMessage(
  'Merge branch develop into main',
  true,
  'Merge commit (should pass)'
);
testCommitMessage(
  'Revert "feat|backend|20250129|Add feature"',
  true,
  'Revert commit (should pass)'
);
testCommitMessage(
  'fixup! Previous commit',
  true,
  'Fixup commit (should pass)'
);
testCommitMessage(
  'squash! Combine commits',
  true,
  'Squash commit (should pass)'
);

// ❌ INVALID COMMITS
console.log('\n📋 Invalid Commits:');
testCommitMessage(
  'added new feature',
  false,
  'No format structure'
);
testCommitMessage(
  'feature|backend|20250129|Add feature',
  false,
  'Wrong type (feature instead of feat)'
);
testCommitMessage(
  'feat|backend|2025-01-29|Add feature',
  false,
  'Date with hyphens instead of YYYYMMDD'
);
testCommitMessage(
  'feat|backend|20250129|Four',
  false,
  'Description too short (< 5 chars)'
);
testCommitMessage(
  'feat|backend|20250129|This is a very long description that exceeds the maximum allowed length of one hundred characters and should fail',
  false,
  'Description too long (> 100 chars)'
);
testCommitMessage(
  'feat|backend|20250129|Has "quotes" in text',
  false,
  'Invalid character: double quotes'
);
testCommitMessage(
  'feat|backend|20250129|Has `backticks` here',
  false,
  'Invalid character: backticks'
);
testCommitMessage(
  'feat|backend|20250129|Command $(injection)',
  false,
  'Invalid character: command injection attempt'
);
testCommitMessage(
  'feat|backend with spaces|20250129|Add feature',
  false,
  'Task ID with spaces'
);
testCommitMessage(
  'feat|backend|20250129|Has emoji 🚀 here',
  false,
  'Invalid character: emoji'
);
testCommitMessage(
  'feat|backend|99999999|Invalid date format',
  true,
  'Edge case: Invalid date passes regex (known limitation)'
);

console.log('\n✅ All tests completed!\n');

// Exit with error code if any test failed
if (process.exitCode === 1) {
  console.error('❌ Some tests failed\n');
} else {
  console.log('🎉 All tests passed!\n');
}
