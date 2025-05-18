/**
 * This script renames all .js files in the components directory to .jsx files
 * Run with: node rename-jsx-files.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory name since __dirname isn't available in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to components directory
const componentsDir = path.join(__dirname, 'src', 'components');

// Get all .js files in the components directory
try {
  const files = fs.readdirSync(componentsDir);
  
  // Filter for .js files
  const jsFiles = files.filter(file => file.endsWith('.js'));
  
  console.log(`Found ${jsFiles.length} .js files to rename:`);
  
  // Rename each file
  jsFiles.forEach(file => {
    const oldPath = path.join(componentsDir, file);
    const newPath = path.join(componentsDir, file.replace('.js', '.jsx'));
    
    try {
      fs.renameSync(oldPath, newPath);
      console.log(`  ✅ Renamed: ${file} -> ${file.replace('.js', '.jsx')}`);
    } catch (err) {
      console.error(`  ❌ Error renaming ${file}: ${err.message}`);
    }
  });
  
  // Now update the imports in index.js
  const indexPath = path.join(__dirname, 'src', 'index.js');
  if (fs.existsSync(indexPath)) {
    let indexContent = fs.readFileSync(indexPath, 'utf8');
    
    // Replace all imports from './components/Component' to './components/Component.jsx'
    jsFiles.forEach(file => {
      const componentName = file.replace('.js', '');
      const oldImport = `./components/${componentName}`;
      const newImport = `./components/${componentName}.jsx`;
      
      indexContent = indexContent.replace(new RegExp(oldImport, 'g'), newImport);
    });
    
    // Write the updated index.js
    fs.writeFileSync(indexPath, indexContent);
    console.log(`Updated imports in src/index.js`);
  }
  
  console.log('All done! 🎉');
} catch (err) {
  console.error(`Error: ${err.message}`);
}