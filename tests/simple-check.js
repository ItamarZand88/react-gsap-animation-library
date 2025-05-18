/**
 * Simplified test script to check if the library files were built correctly.
 * 
 * Run this script after building the library with:
 * node tests/simple-check.js
 */

const fs = require('fs');
const path = require('path');

// Files to check
const filesToCheck = [
  'dist/index.js',
  'dist/index.esm.js'
];

// Check if files exist
let allFilesExist = true;
console.log('Checking build files:');

for (const file of filesToCheck) {
  const filePath = path.join(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath);
    console.log(`✅ ${file} exists (${(stats.size / 1024).toFixed(2)} KB)`);
  } else {
    console.error(`❌ ${file} is missing!`);
    allFilesExist = false;
  }
}

// Final result
console.log('\n--- TEST RESULTS ---');
if (allFilesExist) {
  console.log('✅ ALL TESTS PASSED: Library build files exist.');
} else {
  console.error('❌ TESTS FAILED: Some build files are missing!');
  process.exit(1);
}