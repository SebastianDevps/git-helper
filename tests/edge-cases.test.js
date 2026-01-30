/**
 * Edge Cases and Robustness Tests
 * Copyright (C) 2025 Sebastian Guerra
 * Licensed under GPL-3.0 - see LICENSE file
 *
 * Tests complex scenarios, boundaries, and potential vulnerabilities
 * Run with: node tests/edge-cases.test.js
 */

const assert = require('assert');

const COMMIT_PATTERN = /^(feat|fix|refactor|review|test|docs|chore)\|[a-zA-Z0-9-]+\|\d{8}\|[a-zA-Z0-9 .,!?-]{5,100}$/;
const SPECIAL_PATTERN = /^(Merge|Revert|Fixup|Squash|fixup!|squash!)/i;

function testCommit(msg, shouldPass, description) {
  const isSpecial = SPECIAL_PATTERN.test(msg);
  const matchesPattern = COMMIT_PATTERN.test(msg);
  const passes = isSpecial || matchesPattern;

  try {
    assert.strictEqual(passes, shouldPass, `${description}\n  Got: ${passes ? 'PASS' : 'FAIL'}`);
    console.log(`✅ ${description}`);
  } catch (error) {
    console.error(`❌ ${error.message}`);
    process.exitCode = 1;
  }
}

console.log('\n🧪 Edge Cases & Robustness Tests\n');

// 📋 BOUNDARY TESTS
console.log('📋 Boundary Tests (Min/Max lengths):');
testCommit(
  'feat|a|20250130|12345',
  true,
  'Minimum valid: 5 chars description, 1 char taskId'
);
testCommit(
  'feat|' + 'a'.repeat(50) + '|20250130|' + 'x'.repeat(100),
  true,
  'Maximum valid: 100 chars description, 50 chars taskId'
);
testCommit(
  'feat|a|20250130|' + 'x'.repeat(101),
  false,
  'Description exceeds 100 chars'
);
testCommit(
  'feat|a|20250130|1234',
  false,
  'Description only 4 chars (min is 5)'
);

// 📋 DATE EDGE CASES
console.log('\n📋 Date Format Edge Cases:');
testCommit(
  'feat|task|00000000|Valid message here',
  true,
  'Date all zeros (passes regex but invalid date)'
);
testCommit(
  'feat|task|99999999|Valid message here',
  true,
  'Date all nines (passes regex but invalid date)'
);
testCommit(
  'feat|task|20251301|Invalid month 13',
  true,
  'Invalid month (regex cannot validate semantic date)'
);
testCommit(
  'feat|task|20250230|Feb 30 invalid day',
  true,
  'Invalid day for month (regex limitation)'
);
testCommit(
  'feat|task|2025013|Seven digits only',
  false,
  'Date with only 7 digits'
);
testCommit(
  'feat|task|202501301|Nine digits',
  false,
  'Date with 9 digits'
);

// 📋 TASKID EDGE CASES
console.log('\n📋 TaskID Edge Cases:');
testCommit(
  'feat|a|20250130|Valid message',
  true,
  'Single char taskId'
);
testCommit(
  'feat|123|20250130|Numeric only taskId',
  true,
  'Numeric taskId'
);
testCommit(
  'feat|task-with-many-dashes|20250130|Valid message',
  true,
  'TaskId with multiple dashes'
);
testCommit(
  'feat|UPPERCASE|20250130|Valid message',
  true,
  'Uppercase taskId'
);
testCommit(
  'feat|Mixed-Case-123|20250130|Valid message',
  true,
  'Mixed case alphanumeric taskId'
);
testCommit(
  'feat|task_underscore|20250130|Valid message',
  false,
  'TaskId with underscore (not allowed)'
);
testCommit(
  'feat|task.dot|20250130|Valid message',
  false,
  'TaskId with dot (not allowed)'
);
testCommit(
  'feat|task space|20250130|Valid message',
  false,
  'TaskId with space'
);

// 📋 DESCRIPTION SPECIAL CHARACTERS
console.log('\n📋 Description Special Characters:');
testCommit(
  'feat|task|20250130|Hello, world! How are you?',
  true,
  'Description with comma, exclamation, question mark'
);
testCommit(
  'feat|task|20250130|Multiple...dots...here',
  true,
  'Multiple consecutive dots'
);
testCommit(
  'feat|task|20250130|Dash-separated-words-here',
  true,
  'Dash-separated words'
);
testCommit(
  'feat|task|20250130|Number 123 and text 456',
  true,
  'Mixed numbers and text'
);
testCommit(
  'feat|task|20250130|All CAPS TEXT HERE',
  true,
  'All uppercase description'
);
testCommit(
  'feat|task|20250130|MiXeD CaSe TeXt',
  true,
  'Mixed case description'
);

// ❌ INJECTION ATTEMPTS
console.log('\n📋 Security: Injection Attempts (should all FAIL):');
testCommit(
  'feat|task|20250130|Command $(whoami) here',
  false,
  'Command substitution with $()'
);
testCommit(
  'feat|task|20250130|Backtick `cmd` injection',
  false,
  'Backtick command injection'
);
testCommit(
  'feat|task|20250130|"Double quotes" test',
  false,
  'Double quotes in description'
);
testCommit(
  'feat|task|20250130|Single\'quotes test',
  false,
  'Single quotes in description'
);
testCommit(
  'feat|task|20250130|Semicolon; command',
  false,
  'Semicolon (command separator)'
);
testCommit(
  'feat|task|20250130|Pipe | command',
  false,
  'Pipe character'
);
testCommit(
  'feat|task|20250130|Ampersand & background',
  false,
  'Ampersand (background process)'
);
testCommit(
  'feat|task|20250130|Newline\ninjection',
  false,
  'Newline character injection'
);
testCommit(
  'feat|task|20250130|Tab\there',
  false,
  'Tab character'
);
testCommit(
  'feat|task|20250130|Backslash\\test',
  false,
  'Backslash character'
);

// 📋 WHITESPACE HANDLING
console.log('\n📋 Whitespace Handling:');
testCommit(
  'feat|task|20250130|Single space',
  true,
  'Single space between words'
);
testCommit(
  'feat|task|20250130|Multiple  spaces  here',
  true,
  'Multiple consecutive spaces (allowed)'
);
testCommit(
  'feat|task|20250130| Leading space',
  true,
  'Leading space in description'
);
testCommit(
  'feat|task|20250130|Trailing space ',
  true,
  'Trailing space in description'
);

// 📋 SPECIAL COMMITS VARIATIONS
console.log('\n📋 Special Commits Variations:');
testCommit(
  'Merge pull request #123 from user/branch',
  true,
  'GitHub merge PR format'
);
testCommit(
  'Merge remote-tracking branch origin/develop',
  true,
  'Git merge remote tracking'
);
testCommit(
  'Revert commit abc123def456',
  true,
  'Revert with commit hash'
);
testCommit(
  'fixup! feat|task|20250130|Original commit',
  true,
  'Fixup with formatted message'
);
testCommit(
  'MERGE branch test',
  true,
  'Uppercase MERGE (case insensitive)'
);
testCommit(
  'revert previous change',
  true,
  'Lowercase revert'
);

// 📋 UNICODE AND ENCODING
console.log('\n📋 Unicode/Encoding (should FAIL - not ASCII):');
testCommit(
  'feat|task|20250130|Emoji 🚀 test',
  false,
  'Emoji in description'
);
testCommit(
  'feat|task|20250130|Acción española',
  false,
  'Spanish accented characters'
);
testCommit(
  'feat|task|20250130|日本語 characters',
  false,
  'Japanese characters'
);
testCommit(
  'feat|tarea|20250130|Descripción válida',
  false,
  'Spanish ó in description'
);

console.log('\n✅ Edge cases tests completed!\n');

if (process.exitCode === 1) {
  console.error('❌ Some tests failed\n');
} else {
  console.log('🎉 All edge cases passed!\n');
}
