import * as fs from 'fs';
let content = fs.readFileSync('src/components/SaaSDashboard.tsx', 'utf-8');

let lines = content.split('\n');
let inside = false;
let depth = 0;

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('activeSubView === "overview" && (')) {
    inside = true;
    console.log(`--- Start at line ${i+1}`);
  }
  
  if (inside) {
    let openCount = (lines[i].match(/<div[^>]*>/g) || []).length;
    let selfClose = (lines[i].match(/<div[^>]*\/>/g) || []).length;
    openCount -= selfClose; 
    
    let closeCount = (lines[i].match(/<\/div>/g) || []).length;
    
    depth += (openCount - closeCount);
    
    if (openCount > 0 || closeCount > 0) {
      console.log(`${String(i+1).padStart(4, '0')}: depth=${String(depth).padStart(2, ' ')} (+${openCount} -${closeCount}) | ${lines[i].substring(0, 80).trim()}`);
    }
    
    if (lines[i].includes('{/* ==================== SUB-VIEW 2')) {
      console.log(`--- End at line ${i}`);
      break;
    }
  }
}
